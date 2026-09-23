import { useMemo, useState } from 'react';
import { useCVStore } from '../../store/useCVStore';
import { Wrench, CheckCircle2, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { CV_DATA } from '../../constants/cvData';
import type { CVSkill, SkillCategory } from '../../types/cv';

export default function StepSkills() {
  const { formData, updateFormData, nextStep, prevStep, setStep } = useCVStore();
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState<SkillCategory>('Mesleki Bilgi');

  // Seçili unvanın önerilen yeteneklerini getir
  const suggestedSkills = useMemo(() => {
    const sector = CV_DATA.find(s => s.id === formData.sectorId);
    if (!sector) return [];
    const jobTitle = sector.jobTitles.find(t => t.name === formData.jobTitleName);
    return jobTitle ? jobTitle.suggestedSkills : [];
  }, [formData.sectorId, formData.jobTitleName]);

  const handleToggleSkill = (skill: CVSkill) => {
    const exists = formData.selectedSkills.find(s => s.name === skill.name);
    if (exists) {
      updateFormData({ selectedSkills: formData.selectedSkills.filter(s => s.name !== skill.name) });
    } else {
      updateFormData({ selectedSkills: [...formData.selectedSkills, { name: skill.name, category: skill.category }] });
    }
  };

  const handleAddCustomSkill = () => {
    let cleanName = customSkillInput.trim();
    if (cleanName.length < 2) return;

    if (cleanName.length > 50) {
      alert("Yetenek adı çok uzun! ATS botları uzun cümleleri yetenek olarak kabul etmez. Lütfen kısa ve öz (örn: 'Fanuc Ünite') yazın.");
      return;
    }

    const newSkill = { name: cleanName, category: customSkillCategory };
    updateFormData({ customSkills: [...formData.customSkills, newSkill] });
    setCustomSkillInput('');
  };

  const handleRemoveCustomSkill = (name: string) => {
    updateFormData({ customSkills: formData.customSkills.filter(s => s.name !== name) });
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* YETENEKLER & MAKİNE PARKURU */}
      <section>
        <div className="border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-400" />
            Yetenekler & Makine Parkuru
          </h2>
          <p className="text-sm text-base-content/60 mt-1">Sektörünüze uygun önerilerden bildiklerinizi seçin veya kendiniz ekleyin.</p>
        </div>

        {suggestedSkills.length > 0 && (
          <div className="mb-6 p-4 bg-[#1e2329] rounded-xl border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {formData.jobTitleName} İçin Önerilenler
              </p>
              <button onClick={() => setStep(2)} className="text-[10px] sm:text-xs text-amber-400 font-semibold hover:underline">
                İşi Yanlış Mı Seçtin? Geri Dön & Değiştir
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map(skill => {
                const isSelected = formData.selectedSkills.some(s => s.name === skill.name);
                return (
                  <button
                    key={skill.name}
                    onClick={() => handleToggleSkill(skill)}
                    className={`btn btn-sm p-2 rounded-full border transition-all ${isSelected
                      ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/30'
                      : 'bg-[#0f1115] border-white/10 text-base-content/70 hover:border-indigo-500/50 hover:text-white'
                      }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 mr-1" />}
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Kendi Yeteneğini Ekle */}
        <div className="p-4 bg-[#0f1115] rounded-xl border border-dashed border-white/10">
          <p className="text-sm font-semibold text-white mb-3">Farklı bir yetenek ekle:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
              placeholder="Örn: SolidWorks, TIG Kaynağı..."
              className="input p-3 input-bordered bg-[#16191d] border-white/10 text-white flex-1"
            />
            <select
              className="select p-3 select-bordered bg-[#16191d] border-white/10 text-white w-full sm:w-40"
              value={customSkillCategory}
              onChange={(e) => setCustomSkillCategory(e.target.value as SkillCategory)}
            >
              <option value="Mesleki Bilgi">Mesleki Bilgi</option>
              <option value="Makine/Ekipman">Makine/Ekipman</option>
              <option value="Sertifika/Belge">Sertifika/Belge</option>
              <option value="Genel">Genel</option>
            </select>
            <button onClick={handleAddCustomSkill} className="btn btn-sm p-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Ekle
            </button>
          </div>

          {/* Eklenen Özel Yetenekler */}
          {formData.customSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
              {formData.customSkills.map(skill => (
                <div key={skill.name} className="badge badge-lg bg-[#1e2329] border-white/10 text-white gap-2 p-3">
                  {skill.name}
                  <button onClick={() => handleRemoveCustomSkill(skill.name)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ÇALIŞMA DİSİPLİNİ */}
      <section className="pt-4 border-t border-white/5">
        <div className="border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            Çalışma Disiplini & Uyum
          </h2>
          <p className="text-sm text-base-content/60 mt-1">Saha ve fabrika ortamındaki çalışma prensiplerinizi vurgulayın.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.disciplineShifts ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-[#0f1115] border-white/5 hover:border-white/20'}`}>
            <input type="checkbox" className="checkbox checkbox-success checkbox-sm" checked={formData.disciplineShifts} onChange={(e) => updateFormData({ disciplineShifts: e.target.checked })} />
            <div>
              <p className={`font-bold ${formData.disciplineShifts ? 'text-emerald-400' : 'text-white'}`}>Vardiyalı Çalışma</p>
              <p className="text-xs text-base-content/50">Gece/Gündüz vardiyalarına uyum</p>
            </div>
          </label>

          <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.disciplineISG ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-[#0f1115] border-white/5 hover:border-white/20'}`}>
            <input type="checkbox" className="checkbox checkbox-success checkbox-sm" checked={formData.disciplineISG} onChange={(e) => updateFormData({ disciplineISG: e.target.checked })} />
            <div>
              <p className={`font-bold ${formData.disciplineISG ? 'text-emerald-400' : 'text-white'}`}>İSG Kuralları</p>
              <p className="text-xs text-base-content/50">İş Sağlığı ve Güvenliğine tam uyum</p>
            </div>
          </label>

          <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.discipline5S ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-[#0f1115] border-white/5 hover:border-white/20'}`}>
            <input type="checkbox" className="checkbox checkbox-success checkbox-sm" checked={formData.discipline5S} onChange={(e) => updateFormData({ discipline5S: e.target.checked })} />
            <div>
              <p className={`font-bold ${formData.discipline5S ? 'text-emerald-400' : 'text-white'}`}>5S Tertip & Düzen</p>
              <p className="text-xs text-base-content/50">Çalışma alanı temizliği ve düzeni</p>
            </div>
          </label>

          <label className={`cursor-pointer flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.disciplineHeavy ? 'bg-emerald-900/10 border-emerald-500/30' : 'bg-[#0f1115] border-white/5 hover:border-white/20'}`}>
            <input type="checkbox" className="checkbox checkbox-success checkbox-sm" checked={formData.disciplineHeavy} onChange={(e) => updateFormData({ disciplineHeavy: e.target.checked })} />
            <div>
              <p className={`font-bold ${formData.disciplineHeavy ? 'text-emerald-400' : 'text-white'}`}>Ağır Tempo</p>
              <p className="text-xs text-base-content/50">Fiziksel güce dayalı, tempolu çalışma</p>
            </div>
          </label>
        </div>
      </section>

      {/* Navigasyon Butonları */}
      <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
        <button onClick={prevStep} className="btn btn-ghost p-3 text-base-content/70 hover:text-white">
          <ChevronLeft className="w-5 h-5 mr-1" /> Geri Dön
        </button>
        <button onClick={nextStep} className="btn border-none p-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50">
          Sonraki Adım (Ek Bilgiler) <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}

