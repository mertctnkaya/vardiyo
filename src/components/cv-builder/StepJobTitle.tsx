import React, { useMemo } from 'react';
import { useCVStore } from '../../store/useCVStore';
import { Briefcase, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import { CV_DATA } from '../../constants/cvData';

export default function StepJobTitle() {
  const { formData, updateFormData, nextStep, prevStep } = useCVStore();

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Sektör değiştiğinde unvanı ve özeti sıfırla ki eski sektörün verisi kalmasın
    updateFormData({
      sectorId: e.target.value,
      jobTitleName: '',
      summary: ''
    });
  };

  const handleTitleSelect = (titleName: string) => {
    updateFormData({ jobTitleName: titleName });
  };

  const handleSummarySelect = (text: string) => {
    updateFormData({ summary: text });
  };

  // Seçili sektörü bul
  const selectedSector = useMemo(() => {
    return CV_DATA.find(s => s.id === formData.sectorId);
  }, [formData.sectorId]);

  // Eğer unvan seçildiyse, o unvanın hazır özet şablonlarını getir
  const currentTitleTemplates = useMemo(() => {
    if (!selectedSector || !formData.jobTitleName) return [];
    const title = selectedSector.jobTitles.find(t => t.name === formData.jobTitleName);
    return title ? title.summaryTemplates : [];
  }, [selectedSector, formData.jobTitleName]);

  const isComplete = formData.sectorId !== '' && formData.jobTitleName.length > 2 && formData.summary.length > 10;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Meslek & Kariyer Özeti
        </h2>
        <p className="text-sm text-base-content/60 mt-1">Hangi alanda uzmansınız? İK uzmanlarının CV'nizde ilk okuyacağı özet cümlesini belirleyin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sektör Seçimi */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Sektör *</span>
          </label>
          <select
            className="select p-3 select-bordered w-full bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
            value={formData.sectorId}
            onChange={handleSectorChange}
          >
            <option value="" disabled>Sektör Seçiniz</option>
            {CV_DATA.map(sector => (
              <option key={sector.id} value={sector.id}>{sector.name}</option>
            ))}
          </select>
        </div>

        {/* Unvan Girdisi / Seçimi */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">İş Unvanı *</span>
          </label>
          <input
            type="text"
            name="jobTitleName"
            value={formData.jobTitleName}
            onChange={(e) => updateFormData({ jobTitleName: e.target.value })}
            placeholder="Örn: CNC Torna Operatörü"
            className="input p-3 input-bordered w-full bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
            disabled={!formData.sectorId}
          />
        </div>
      </div>

      {/* Sektöre Göre Akıllı Unvan Önerileri */}
      {selectedSector && (
        <div className="mt-3 p-4 bg-[#1e2329] rounded-xl border border-white/5">
          <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">Önerilen Unvanlar (Tıkla Seç)</p>
          <div className="flex flex-wrap gap-2">
            {selectedSector.jobTitles.map(title => (
              <button
                key={title.id}
                onClick={() => handleTitleSelect(title.name)}
                className={`btn btn-sm p-2 rounded-full border-none transition-all ${formData.jobTitleName === title.name
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0f1115] text-base-content/70 hover:bg-white/10'
                  }`}
              >
                {title.name}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-start gap-3">
            <span className="text-xs text-base-content/50">Aradığınız unvan listede yok mu?</span>
            <button onClick={() => window.open('/contact', '_blank')} className="btn btn-xs p-3 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border-emerald-500/30">
              Bize Önerin
            </button>
          </div>
        </div>
      )}

      {/* Başlangıç Durumu */}
      <div className="form-control w-full pt-4 border-t border-white/5">
        <label className="label flex flex-col items-start gap-1">
          <span className="label-text text-white">İşe Başlama Durumu</span>
          <span className="label-text-alt text-[10px] mb-2 text-amber-400">İşverenler için önemli bir detaydır.</span>
        </label>
        <select
          className="select p-3 select-bordered w-full md:w-1/2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
          value={formData.availability}
          onChange={(e) => updateFormData({ availability: e.target.value as any })}
        >
          <option value="" disabled>Seçiniz (Opsiyonel)</option>
          <option value="Hemen Başlayabilir">Hemen Başlayabilir</option>
          <option value="15 Gün İçinde">15 Gün İçinde</option>
          <option value="1 Ay İçinde">1 Ay İçinde</option>
          <option value="İhbar Süresi Var">İhbar Süresi Var</option>
        </select>
      </div>

      {/* Kariyer Özeti Alanı */}
      <div className="form-control w-full pt-4">
        <label className="label">
          <span className="label-text text-white mb-2 font-semibold">Kariyer Özeti (Kendini Tanıt) *</span>
        </label>

        {/* Akıllı Şablonlar */}
        {currentTitleTemplates.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-indigo-400 mb-2 flex items-center gap-1">
              <Target className="w-4 h-4" /> Size özel hazırladığımız profesyonel şablonlardan birini seçebilirsiniz:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {currentTitleTemplates.map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => handleSummarySelect(tpl.text)}
                  className="p-3 rounded-lg bg-[#0f1115] border border-white/10 hover:border-indigo-500/50 cursor-pointer transition-colors group"
                >
                  <p className="text-xs font-bold text-white mb-1 group-hover:text-indigo-400">{tpl.level} Şablonu</p>
                  <p className="text-xs text-base-content/60 line-clamp-3">{tpl.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          className="textarea p-3 textarea-bordered w-full h-28 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
          placeholder="İş tecrübelerinizi, çalışma disiplininizi ve hedeflerinizi kısaca özetleyin..."
          value={formData.summary}
          onChange={(e) => updateFormData({ summary: e.target.value })}
        ></textarea>
      </div>


      {/* Navigasyon Butonları */}
      <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
        <button
          onClick={prevStep}
          className="btn btn-ghost p-3 text-base-content/70 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Geri Dön
        </button>
        <button
          onClick={nextStep}
          disabled={!isComplete}
          className="btn border-none p-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki Adım (Eğitim & Deneyim)
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}

