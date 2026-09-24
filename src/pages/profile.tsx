import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, isPremiumUser } from '../store/useAppStore';
import { useCVStore } from '../store/useCVStore';
import { supabase } from '../lib/supabaseClient';
import AccountSection from '../components/settings/AccountSection';
import SubscriptionSection from '../components/settings/SubscriptionSection';
import NotificationSection from '../components/settings/NotificationSection';
import { registerAndSubscribeToPush } from '../lib/pushNotifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNative } from "../utils/isNative";
import { useToastStore } from '../store/useToastStore';
import { usePageTitle } from '../hooks/usePageTitle';
import type { CVFormData } from '../types/cv';
import { pdf } from '@react-pdf/renderer';
import CVPdfDocument from '../components/cv-builder/CVPdfDocument';
import CVPdfWorkshop from '../components/cv-builder/CVPdfWorkshop';
import { fetchUserSettings, updateUserSettings } from '../services/dbService';
import PremiumPaywallModal from '../components/shared/PremiumPaywallModal';

type SavedCV = {
  id: string;
  created_at: string;
  job_title: string;
  form_data: CVFormData;
};

export default function Profile() {
  usePageTitle('Hesabım');
  const navigate = useNavigate();
  const { user, settings, isRevenueCatPro } = useAppStore();
  const { loadCVForEdit } = useCVStore();
  const { addToast } = useToastStore();
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [isLoadingCVs, setIsLoadingCVs] = useState(true);

  const isPro = isPremiumUser(settings, isRevenueCatPro);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Notification states
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const [notifPrefs, setNotifPrefs] = useState({
    shift_changes: true, holidays: true, reminders: true, payroll: true,
    risks: true, annual_leave: true, daily_log: false, weekly_summary: false,
    night_shift_health: false, app_updates: false
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      // Fetch CVs
      const { data: cvData, error: cvError } = await supabase
        .from('user_cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!cvError && cvData) {
        setSavedCVs(cvData as SavedCV[]);
      }
      setIsLoadingCVs(false);

      // Fetch Notification Prefs from settings
      const settingsData = await fetchUserSettings(user.id);
      if (settingsData?.notification_preferences) {
        setNotifPrefs(settingsData.notification_preferences);
      }
    };

    fetchProfileData();

    // Check notification permissions
    const checkNotificationStatus = async () => {
      if (isNative()) {
        const permStatus = await LocalNotifications.checkPermissions();
        setNotificationStatus(permStatus.display === 'prompt' ? 'default' : permStatus.display);
      } else {
        if ('Notification' in window) {
          setNotificationStatus(Notification.permission);
        } else {
          setNotificationStatus('denied');
        }
      }
    };
    checkNotificationStatus();
  }, [user]);

  const handleRequestPermission = async () => {
    if (!user) return;
    try {
      if (isNative()) {
        const permStatus = await LocalNotifications.requestPermissions();
        const finalStatus = permStatus.display === 'prompt' ? 'default' : permStatus.display;
        setNotificationStatus(finalStatus);
        if (finalStatus === 'granted') {
          addToast('Mobil bildirim izni başarıyla alındı!', 'success');
        }
      } else {
        const newStatus = await registerAndSubscribeToPush(user.id);
        if (newStatus) setNotificationStatus(newStatus);
      }
    } catch (error) {
      addToast("İzin istenirken hata oluştu.", 'error');
    }
  };

  const handleTogglePref = async (key: keyof typeof notifPrefs) => {
    if (!user) return;
    const newPrefs = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(newPrefs);
    await updateUserSettings(user.id, { notification_preferences: newPrefs });
  };

  const handleDownloadCV = async (cv: SavedCV, type: 'corporate' | 'workshop') => {
    try {
      const doc = type === 'corporate'
        ? <CVPdfDocument data={cv.form_data} />
        : <CVPdfWorkshop data={cv.form_data} />;

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vardiyo_CV_${cv.form_data.firstName}_${cv.form_data.lastName}_${type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      addToast(`Hata: ${err.message || 'PDF oluşturulurken bir hata oluştu.'}`, 'error');
    }
  };

  const handleDeleteCV = async (id: string) => {
    if (!window.confirm('Bu CV\'yi kalıcı olarak silmek istediğinize emin misiniz ? ')) return;

    try {
      const { error } = await supabase.from('user_cvs').delete().eq('id', id);
      if (error) throw error;
      setSavedCVs(prev => prev.filter(cv => cv.id !== id));
      addToast('CV başarıyla silindi.', 'success');
    } catch (err: any) {
      addToast(`Hata: ${err.message || 'CV silinirken hata oluştu.'}`, 'error');
    }
  };

  const handleDeleteAllCVs = async () => {
    if (!user) return;
    if (!window.confirm('Tüm kayıtlı CV\'lerinizi kalıcı olarak silmek istediğinize emin misiniz ? ')) return;

    try {
      const { error } = await supabase.from('user_cvs').delete().eq('user_id', user.id);
      if (error) throw error;
      setSavedCVs([]);
      addToast('Tüm CV\'ler başarıyla silindi.', 'success');
    } catch (err: any) {
      addToast(`Hata: ${err.message || 'CV\'ler silinirken hata oluştu.'}`, 'error');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 w-full text-center">
        <h2 className="text-2xl font-bold text-base-content mb-4">Giriş Yapmalısınız</h2>
        <p className="text-base-content/70">Hesap bilgilerinizi ve CV'lerinizi görmek için giriş yapın.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">
      <div className="w-full max-w-3xl bg-[#16191d] rounded-xl shadow-2xl border border-base-300 overflow-hidden">
        <div className="bg-[#1e2329] p-6 border-b border-base-300">
          <h1 className="text-2xl font-black text-indigo-400">Hesabım</h1>
          <p className="text-sm text-base-content/60 mt-1">Profil bilgilerinizi, CV'lerinizi ve bildirim ayarlarınızı buradan yönetin.</p>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          {/* Account Details & Deletion */}
          <AccountSection />

          {/* Subscription / Plan Details */}
          <SubscriptionSection />

          {/* CVs Section */}
          <div className="space-y-6 pt-6 border-t border-base-300">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Kayıtlı CV'lerim
              </h3>

              {!isLoadingCVs && savedCVs.length > 0 && (
                <button
                  onClick={handleDeleteAllCVs}
                  className="btn btn-xs sm:btn-sm btn-ghost hover:bg-red-900/20 text-red-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-1 hidden sm:inline" /> Tümünü Sil
                </button>
              )}
            </div>

            {isLoadingCVs ? (
              <div className="flex justify-center py-4">
                <span className="loading loading-spinner text-indigo-500"></span>
              </div>
            ) : savedCVs.length === 0 ? (
              <div className="bg-[#1e2329] rounded-xl p-6 border border-base-300 text-center">
                <p className="text-base-content/60">Henüz kaydedilmiş bir CV'niz bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedCVs.map((cv) => (
                  <div key={cv.id} className="bg-[#1e2329] rounded-xl p-5 border border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-base-content text-lg">{cv.form_data.firstName} {cv.form_data.lastName}</h4>
                      <p className="text-sm text-base-content/70">{cv.job_title}</p>
                      <p className="text-xs text-base-content/40 mt-1">
                        Oluşturulma: {new Date(cv.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleDownloadCV(cv, 'corporate')}
                        className="btn btn-sm p-2 bg-indigo-900/30 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30"
                      >
                        Kurumsal İndir
                      </button>
                      <button
                        onClick={() => handleDownloadCV(cv, 'workshop')}
                        className="btn btn-sm p-2 bg-amber-900/30 text-amber-400 hover:bg-amber-600 hover:text-white border border-amber-500/30"
                      >
                        Atölye İndir
                      </button>
                      <button
                        onClick={() => {
                          if (!isPro) {
                            setIsPaywallOpen(true);
                            return;
                          }
                          loadCVForEdit(cv.id, cv.form_data);
                          navigate('/cv-builder');
                        }}
                        className="btn btn-sm p-2 bg-[#0f1115] border border-base-300 text-base-content/80 hover:bg-base-200 hover:text-white mt-2 sm:mt-0"
                      >
                        <Edit className="w-4 h-4 mr-1 sm:mr-0 lg:mr-1" /> <span className="sm:hidden lg:inline">Düzenle {!isPro && '(PRO)'}</span>
                      </button>
                      <button onClick={() => handleDeleteCV(cv.id)} className="btn btn-sm p-2 btn-ghost hover:bg-red-900/20 text-red-500 hover:text-red-400 mt-2 sm:mt-0">
                        <Trash2 className="w-4 h-4 mr-1 sm:mr-0 lg:mr-1" /> <span className="sm:hidden lg:inline">Sil</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Section */}
          <div className="pt-6 border-t border-base-300">
            <NotificationSection
              notificationStatus={notificationStatus}
              onRequestPermission={handleRequestPermission}
              prefs={notifPrefs}
              onToggle={handleTogglePref}
            />
          </div>

        </div>
      </div>
      <PremiumPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName="Oluşturulmuş CV'leri Düzenleme"
      />
    </div>
  );
}
