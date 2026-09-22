import { useState, useEffect, useRef } from 'react';
import { useCVStore } from '../../store/useCVStore';
import { useAppStore } from '../../store/useAppStore';
import { useToastStore } from '../../store/useToastStore';
import { supabase } from '../../lib/supabaseClient';
import { pdf } from '@react-pdf/renderer';
import CVPdfDocument from './CVPdfDocument';
import CVPdfWorkshop from './CVPdfWorkshop';
import { FileDown, Building2, Wrench, CheckCircle2, Trash2 } from 'lucide-react';
import PremiumPaywallModal from '../shared/PremiumPaywallModal';

type PdfFormat = 'kurumsal' | 'atolye';

export default function CVPreview() {
  const { user, settings } = useAppStore();
  const { formData, resetForm, savedCvId, setSavedCvId } = useCVStore();
  const { addToast } = useToastStore();
  const [downloading, setDownloading] = useState<PdfFormat | null>(null);
  const [downloaded, setDownloaded] = useState<PdfFormat[]>([]);
  const hasSavedRef = useRef(false);

  const isPro = settings?.role === 'premium' || settings?.role === 'admin';
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  useEffect(() => {
    const saveCVToProfile = async () => {
      if (!user || hasSavedRef.current) return;
      hasSavedRef.current = true;

      try {
        const { photo, ...formDataWithoutPhoto } = formData;

        if (savedCvId) {
          const { error } = await supabase.from('user_cvs').update({
            job_title: formData.jobTitleName || 'İsimsiz CV',
            form_data: formDataWithoutPhoto,
          }).eq('id', savedCvId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase.from('user_cvs').insert({
            user_id: user.id,
            job_title: formData.jobTitleName || 'İsimsiz CV',
            form_data: formDataWithoutPhoto,
          }).select().single();
          if (error) throw error;

          if (data && data.id) {
            setSavedCvId(data.id);
          }
        }
      } catch (err) {
        console.error('CV kaydetme hatası:', err);
      }
    };
    saveCVToProfile();
  }, [user, formData, savedCvId, setSavedCvId]);

  const handleDownload = async (format: PdfFormat) => {
    setDownloading(format);
    try {
      const doc = format === 'kurumsal'
        ? <CVPdfDocument data={formData} />
        : <CVPdfWorkshop data={formData} />;

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const safeName = `${formData.firstName}_${formData.lastName}`.replace(/\s+/g, '_');
      const suffix = format === 'kurumsal' ? 'Kurumsal_ATS' : 'Atolye_Gorsel';
      link.href = url;
      link.download = `CV_${safeName}_${suffix}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (!downloaded.includes(format)) {
        setDownloaded(prev => [...prev, format]);
      }
    } catch (err: any) {
      console.error('PDF oluşturma hatası:', err);
      addToast(`Hata: ${err.message || 'PDF oluşturulurken font hatası veya başka bir sorun oluştu.'}`, 'error');
    } finally {
      setDownloading(null);
    }
  };

  // Özet bilgiler
  const allSkillCount = formData.selectedSkills.length + formData.customSkills.length;
  const expCount = formData.experiences.filter(e => e.company.trim()).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Başarı Mesajı */}
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">CV'niz Hazır!</h2>
        <p className="text-base-content/60 mt-2 max-w-md mx-auto">
          Aşağıdaki 2 farklı formattan dilediğinizi (veya ikisini birden) indirebilirsiniz.
          İhtiyacınıza göre doğru formatı seçin.
        </p>
      </div>

      {/* CV Özet Kartı */}
      <div className="bg-[#0f1115] rounded-xl border border-white/10 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{formData.firstName} {formData.lastName}</h3>
            <p className="text-indigo-400 font-medium">{formData.jobTitleName}</p>
            <p className="text-base-content/50 text-sm mt-1">
              {formData.city}{formData.district ? ` / ${formData.district}` : ''}
            </p>
          </div>
          <div className="text-right">
            <div className="badge badge-ghost badge-sm">{expCount} Deneyim</div>
            <div className="badge badge-ghost badge-sm ml-1">{allSkillCount} Yetenek</div>
          </div>
        </div>
        {formData.summary && (
          <p className="text-xs text-base-content/40 mt-3 line-clamp-2 border-t border-white/5 pt-3">{formData.summary}</p>
        )}
      </div>

      {/* İndirme Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Kurumsal / ATS Format */}
        <div className="bg-[#1e2329] rounded-xl border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white">Kurumsal Format</h3>
            </div>
            <p className="text-xs text-base-content/60 mb-4">
              ATS (Aday Takip Sistemi) robotlarının %100 okuyabildiği, metin tabanlı, tek sütunlu,
              sade ve profesyonel CV. Ford, Arçelik, THY gibi kurumsal şirketlere başvuruda ideal.
            </p>
            <ul className="text-xs text-base-content/50 space-y-1 mb-4">
              <li>✓ Metin tabanlı — makine okumasına uygun</li>
              <li>✓ Tek sütun — düz akış</li>
              <li>✓ Fotoğrafsız — ayrımcılık riski sıfır</li>
            </ul>
          </div>
          <button
            onClick={() => handleDownload('kurumsal')}
            disabled={downloading === 'kurumsal'}
            className={`btn w-full border-none shadow-lg ${downloaded.includes('kurumsal')
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/50'
              }`}
          >
            {downloading === 'kurumsal' ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : downloaded.includes('kurumsal') ? (
              <><CheckCircle2 className="w-4 h-4 mr-1" /> İndirildi — Tekrar İndir</>
            ) : (
              <><FileDown className="w-4 h-4 mr-1" /> Kurumsal PDF İndir</>
            )}
          </button>
        </div>

        {/* Atölye / Usta Format */}
        <div className="bg-[#1e2329] rounded-xl border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Atölye & Usta Formatı</h3>
            </div>
            <p className="text-xs text-base-content/60 mb-4">
              Görsel yetkinlik rozetli, fotoğraf destekli, dikkat çekici saha profili.
              OSB, KOBİ ve ustabaşı/patron mülakatlarına elden verilecek CV için ideal.
            </p>
            <ul className="text-xs text-base-content/50 space-y-1 mb-4">
              <li>✓ Koyu başlık banner'ı — göz alıcı</li>
              <li>✓ Yetkinlik rozetleri — hızlı tarama</li>
              <li>✓ Fotoğraf destekli — kişisel izlenim</li>
            </ul>
          </div>
          <button
            onClick={() => handleDownload('atolye')}
            disabled={downloading === 'atolye'}
            className={`btn w-full border-none shadow-lg ${downloaded.includes('atolye')
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/50'
              }`}
          >
            {downloading === 'atolye' ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : downloaded.includes('atolye') ? (
              <><CheckCircle2 className="w-4 h-4 mr-1" /> İndirildi — Tekrar İndir</>
            ) : (
              <><FileDown className="w-4 h-4 mr-1" /> Atölye PDF İndir</>
            )}
          </button>
        </div>
      </div>

      {/* Navigasyon / Temizleme */}
      <div className="flex justify-center pt-8 border-t border-white/5">
        <button
          onClick={() => {
            if (window.confirm('Tüm CV form verileriniz (eğitim, deneyim vb.) silinecek ve en başa döneceksiniz. Emin misiniz?')) {
              if (!isPro) {
                setIsPaywallOpen(true);
                return;
              }
              resetForm();
              window.scrollTo(0, 0);
            }
          }}
          className="btn btn-outline border-red-500/50 text-red-400 hover:bg-red-600 hover:border-red-600 hover:text-white w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Temizle & Yeni CV Oluştur {!isPro && '(PRO)'}
        </button>
      </div>
      <PremiumPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName="Sınırsız Yeni CV Oluşturma"
      />
    </div>
  );
}

