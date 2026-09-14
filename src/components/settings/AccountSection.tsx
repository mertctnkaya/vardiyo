import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabaseClient';
import { downloadDataAsJSON } from '../../utils/exportUtils';
import Alert from '../shared/Alert';

export default function AccountSection() {
  const { user, setUser, setSession, setSettings } = useAppStore();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  if (!user) return null;

  const userName = user.user_metadata?.name || 'Kullanıcı';
  const userEmail = user.email || '';
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const [workLogs, settings, reminders] = await Promise.all([
        supabase.from('work_logs').select('*').eq('user_id', user.id),
        supabase.from('user_settings').select('*').eq('user_id', user.id),
        supabase.from('reminders').select('*').eq('user_id', user.id),
      ]);

      const exportPayload = {
        exported_at: new Date().toISOString(),
        user_info: { id: user.id, email: userEmail, name: userName },
        work_logs: workLogs.data || [],
        settings: settings.data || [],
        reminders: reminders.data || [],
      };

      const fileName = `Vardiyo_Verilerim_${new Date().toISOString().split('T')[0]}.json`;
      downloadDataAsJSON(fileName, exportPayload);
    } catch {
      alert('Veri dışa aktarılırken bir hata oluştu.');
    }
    setIsExporting(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail.trim().toLowerCase() !== userEmail.toLowerCase()) {
      setDeleteError('E-posta adresi eşleşmiyor.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;

      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setSettings(null);
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setDeleteError('Hesap silinirken hata oluştu: ' + message);
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteConfirmEmail('');
    setDeleteError('');
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6 mt-4 border-t border-base-300 pt-8">
      <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Hesap Bilgileri
      </h3>

      {/* User Info Card */}
      <div className="bg-[#1e2329] rounded-xl p-5 border border-base-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-black shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-base-content truncate">{userName}</p>
            <p className="text-sm text-base-content/60 truncate">{userEmail}</p>
            {memberSince && (
              <p className="text-xs text-base-content/40 mt-1">Üyelik: {memberSince}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/forgot-password"
          className="btn bg-[#1e2329] border-base-300 hover:bg-indigo-600 hover:border-indigo-600 text-base-content hover:text-white transition-all h-auto py-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Şifremi Değiştir
        </Link>
        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="btn bg-[#1e2329] border-base-300 hover:bg-emerald-600 hover:border-emerald-600 text-base-content hover:text-white transition-all h-auto py-3"
        >
          {isExporting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          Verilerimi İndir (JSON)
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-5 mt-4">
        <h4 className="text-base font-bold text-red-400 mb-2">Tehlikeli Bölge</h4>
        <p className="text-sm text-base-content/60 mb-4">
          Hesabınızı sildiğinizde tüm mesai kayıtlarınız, ayarlarınız, hatırlatıcılarınız ve diğer verileriniz <strong className="text-red-400">kalıcı olarak</strong> silinir. Bu işlem geri alınamaz.
        </p>
        <button
          onClick={openDeleteModal}
          className="btn btn-sm p-3 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 hover:border-red-600 transition-all"
        >
          Hesabımı Kalıcı Olarak Sil
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteModal(false)} />
          <div className="bg-[#16191d] border border-red-500/30 rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl w-full max-w-md animate-fade-in">
            <h3 className="text-xl font-black text-red-400 mb-2">Hesabı Kalıcı Olarak Sil</h3>
            <p className="text-sm text-base-content/70 mb-4">
              Bu işlem geri alınamaz. Tüm mesai kayıtlarınız, bordro ayarlarınız ve hatırlatıcılarınız kalıcı olarak silinecektir.
            </p>

            <Alert color="red" icon="warning" className="mb-4">
              Onaylamak için e-posta adresinizi aşağıya yazın: <strong className="text-red-300 select-all">{userEmail}</strong>
            </Alert>

            {deleteError && (
              <Alert color="red" icon="warning" className="mb-4">{deleteError}</Alert>
            )}

            <input
              type="email"
              placeholder="E-posta adresinizi yazın..."
              className="input input-bordered w-full bg-base-200 border-red-500/30 focus:border-red-500 mb-4"
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              disabled={isDeleting}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="btn flex-1 btn-ghost hover:bg-base-300 text-base-content/80"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmEmail.trim().toLowerCase() !== userEmail.toLowerCase()}
                className="btn flex-1 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/40 disabled:opacity-40"
              >
                {isDeleting ? <span className="loading loading-spinner" /> : 'Kalıcı Olarak Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

