import { useCVStore } from '../../store/useCVStore';
import { GraduationCap, Briefcase, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import type { CVExperience, CVEducation } from '../../types/cv';

export default function StepExperience() {
  const { formData, updateFormData, nextStep, prevStep } = useCVStore();

  // --- Deneyim İşlemleri ---
  const handleAddExperience = () => {
    if (formData.experiences.length >= 3) return;
    const newExp: CVExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    updateFormData({ experiences: [...formData.experiences, newExp] });
  };

  const handleUpdateExperience = (id: string, field: keyof CVExperience, value: string) => {
    const updated = formData.experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateFormData({ experiences: updated });
  };

  const handleRemoveExperience = (id: string) => {
    updateFormData({ experiences: formData.experiences.filter(exp => exp.id !== id) });
  };

  // --- Eğitim İşlemleri ---
  const handleAddEducation = () => {
    if (formData.educations.length >= 2) return; // Eğitim max 2
    const newEdu: CVEducation = {
      id: Date.now().toString(),
      level: 'Meslek Lisesi',
      schoolName: '',
      department: '',
      startDate: '',
      endDate: ''
    };
    updateFormData({ educations: [...formData.educations, newEdu] });
  };

  const handleUpdateEducation = (id: string, field: keyof CVEducation, value: string) => {
    const updated = formData.educations.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateFormData({ educations: updated });
  };

  const handleRemoveEducation = (id: string) => {
    updateFormData({ educations: formData.educations.filter(edu => edu.id !== id) });
  };

  const handleNextStep = () => {
    // İş Deneyimi Validasyonu
    for (const exp of formData.experiences) {
      if (!exp.company || !exp.position || !exp.startDate || !exp.endDate || !exp.description) {
        alert("Lütfen eklediğiniz iş deneyimlerinde tüm alanları (Şirket, Pozisyon, Başlangıç, Bitiş ve İş Özeti) eksiksiz doldurun. İş özetinde vardiya, makine gibi detaylardan bahsetmeyi unutmayın.");
        return;
      }
    }
    // Eğitim Validasyonu
    for (const edu of formData.educations) {
      if (!edu.schoolName || !edu.startDate || !edu.endDate) {
        alert("Lütfen eklediğiniz eğitimlerde kurum adı, başlangıç ve bitiş yıllarını mutlaka doldurun.");
        return;
      }
    }
    nextStep();
  };


  return (
    <div className="space-y-8 animate-fade-in">

      {/* İŞ DENEYİMİ BÖLÜMÜ */}
      <section>
        <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              İş Deneyimi
            </h2>
            <p className="text-sm text-base-content/60 mt-1">En son çalıştığınız yerlerden başlayarak ekleyin. (Max 3)</p>
          </div>
          {formData.experiences.length < 3 && (
            <button onClick={handleAddExperience} className="btn btn-sm p-3 btn-outline border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white">
              <Plus className="w-4 h-4 mr-1" /> Ekle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.experiences.length === 0 ? (
            <div className="text-center py-6 bg-[#0f1115] border border-dashed border-white/10 rounded-xl">
              <p className="text-base-content/50 text-sm mb-2">Henüz iş deneyimi eklemediniz.</p>
              <button onClick={handleAddExperience} className="btn btn-sm p-3 border-none bg-white/5 hover:bg-white/10 text-white">
                <Plus className="w-4 h-4 mr-1" /> İlk Deneyimi Ekle
              </button>
            </div>
          ) : (
            formData.experiences.map((exp, index) => (
              <div key={exp.id} className="p-4 bg-[#1e2329] rounded-xl border border-white/5 relative">
                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="absolute top-3 right-3 text-base-content/40 hover:text-red-400 transition-colors p-1"
                  title="Deneyimi Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wider">{index + 1}. Deneyim</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Firma Adı *</span></label>
                    <input type="text" value={exp.company} onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)} placeholder="Örn: Ford Otosan" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Pozisyon/Unvan *</span></label>
                    <input type="text" value={exp.position} onChange={e => handleUpdateExperience(exp.id, 'position', e.target.value)} placeholder="Örn: CNC Operatörü" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-xs">Başlangıç Tarihi</span>
                    </label>
                    <input type="text" value={exp.startDate} onChange={e => handleUpdateExperience(exp.id, 'startDate', e.target.value)} placeholder="Örn: 06/2021" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                    <p className="text-[10px] text-base-content/50 mt-1 pl-1">Örn format: ay/yıl (06/2021)</p>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-xs">Bitiş Tarihi</span>
                      <button onClick={() => handleUpdateExperience(exp.id, 'endDate', 'Devam Ediyor')} className="text-[10px] text-emerald-400 font-bold hover:underline">"Devam Ediyor" yap</button>
                    </label>
                    <input type="text" value={exp.endDate} onChange={e => handleUpdateExperience(exp.id, 'endDate', e.target.value)} placeholder="Örn: Devam Ediyor" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                    <p className="text-[10px] text-base-content/50 mt-1 pl-1">Örn format: ay/yıl (08/2026)</p>
                  </div>
                  <div className="form-control md:col-span-2">
                    <label className="label"><span className="label-text text-white text-xs">Yaptığınız İşin Özeti (Kısa)</span></label>
                    <textarea value={exp.description} onChange={e => handleUpdateExperience(exp.id, 'description', e.target.value)} placeholder="Örn: Metal şekillendirme hattında çalıştım..." className="textarea p-3 w-full textarea-bordered bg-[#0f1115] border-white/10 text-white h-20"></textarea>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>


      {/* EĞİTİM BÖLÜMÜ */}
      <section className="pt-4 border-t border-white/5">
        <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Eğitim & Mesleki Kurslar
            </h2>
            <p className="text-sm text-base-content/60 mt-1">İlkokul, lise veya mesleki/İŞKUR kurslarınızı ekleyin. (Max 2)</p>
          </div>
          {formData.educations.length < 2 && (
            <button onClick={handleAddEducation} className="btn btn-sm p-3 btn-outline border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white">
              <Plus className="w-4 h-4 mr-1" /> Ekle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.educations.length === 0 ? (
            <div className="text-center py-6 bg-[#0f1115] border border-dashed border-white/10 rounded-xl">
              <p className="text-base-content/50 text-sm mb-2">Henüz eğitim bilgisi eklemediniz.</p>
              <button onClick={handleAddEducation} className="btn btn-sm p-3 border-none bg-white/5 hover:bg-white/10 text-white">
                <Plus className="w-4 h-4 mr-1" /> Eğitim Ekle
              </button>
            </div>
          ) : (
            formData.educations.map((edu, index) => (
              <div key={edu.id} className="p-4 bg-[#1e2329] rounded-xl border border-white/5 relative">
                <button
                  onClick={() => handleRemoveEducation(edu.id)}
                  className="absolute top-3 right-3 text-base-content/40 hover:text-red-400 transition-colors p-1"
                  title="Eğitimi Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wider">{index + 1}. Eğitim</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Eğitim Seviyesi *</span></label>
                    <select value={edu.level} onChange={e => handleUpdateEducation(edu.id, 'level', e.target.value as any)} className="select p-3 w-full select-bordered bg-[#0f1115] border-white/10 text-white">
                      <option value="İlkokul">İlkokul</option>
                      <option value="Ortaokul">Ortaokul</option>
                      <option value="Lise">Düz Lise</option>
                      <option value="Meslek Lisesi">Meslek Lisesi</option>
                      <option value="Ön Lisans">Ön Lisans (2 Yıllık)</option>
                      <option value="Lisans">Lisans (4 Yıllık)</option>
                      <option value="Açıköğretim Ön Lisans">Açıköğretim Ön Lisans (2 Yıllık)</option>
                      <option value="Açıköğretim Lisans">Açıköğretim Lisans (4 Yıllık)</option>
                      <option value="Çıraklık Eğitimi">Çıraklık Eğitimi / Ustalık Belgesi</option>
                      <option value="Mesleki Kurs (İŞKUR vb.)">Mesleki Kurs (İŞKUR vb.)</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Okul / Kurum Adı *</span></label>
                    <input type="text" value={edu.schoolName} onChange={e => handleUpdateEducation(edu.id, 'schoolName', e.target.value)} placeholder="Örn: Tuzla Endüstri Meslek Lisesi" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Bölüm / Alan</span></label>
                    <input type="text" value={edu.department} onChange={e => handleUpdateEducation(edu.id, 'department', e.target.value)} placeholder="Örn: Makine Teknolojisi" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-xs">Başlangıç Yılı *</span>
                    </label>
                    <input type="text" value={edu.startDate} onChange={e => handleUpdateEducation(edu.id, 'startDate', e.target.value)} placeholder="Örn: 2018 veya 09/2018" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white text-xs">Bitiş Yılı *</span>
                      <button onClick={() => handleUpdateEducation(edu.id, 'endDate', 'Devam Ediyor')} className="text-[10px] text-emerald-400 font-bold hover:underline">"Devam Ediyor" yap</button>
                    </label>
                    <input type="text" value={edu.endDate} onChange={e => handleUpdateEducation(edu.id, 'endDate', e.target.value)} placeholder="Örn: 2022 veya Devam Ediyor" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

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
          onClick={handleNextStep}
          className="btn border-none p-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50"
        >
          Sonraki Adım (Yetenekler)
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

    </div>
  );
}

