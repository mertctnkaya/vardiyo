import { useCVStore } from '../../store/useCVStore';
import { Settings2, ChevronRight, ChevronLeft, ShieldCheck, Users, Plus, Trash2, Upload } from 'lucide-react';
import { CV_DATA } from '../../constants/cvData';
import type { CVFormData } from '../../types/cv';
import { useState } from 'react';

export default function StepFinalize() {
  const { formData, updateFormData, nextStep, prevStep } = useCVStore();
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      updateFormData({ photo: event.target?.result as string });
      setIsPhotoLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const selectedSector = CV_DATA.find(s => s.id === formData.sectorId);
  const selectedJob = selectedSector?.jobTitles.find(t => t.name === formData.jobTitleName);

  const toggleDriverLicense = (type: string) => {
    const exists = formData.driverLicense.includes(type);
    if (exists) {
      updateFormData({ driverLicense: formData.driverLicense.filter(t => t !== type) });
    } else {
      updateFormData({ driverLicense: [...formData.driverLicense, type] });
    }
  };

  const toggleSRC = (type: string) => {
    const exists = formData.srcDocument.includes(type);
    if (exists) {
      updateFormData({ srcDocument: formData.srcDocument.filter(t => t !== type) });
    } else {
      updateFormData({ srcDocument: [...formData.srcDocument, type] });
    }
  };

  const handleAddReference = () => {
    const refs = formData.references || [];
    if (refs.length >= 2) return;
    const newRef = { id: Date.now().toString(), fullName: '', companyAndTitle: '', phone: '' };
    updateFormData({ references: [...refs, newRef] });
  };

  const handleUpdateReference = (id: string, field: 'fullName' | 'companyAndTitle' | 'phone', value: string) => {
    const refs = formData.references || [];
    const updated = refs.map(ref => ref.id === id ? { ...ref, [field]: value } : ref);
    updateFormData({ references: updated });
  };

  const handleRemoveReference = (id: string) => {
    const refs = formData.references || [];
    updateFormData({ references: refs.filter(ref => ref.id !== id) });
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Sektöre Özel Zorunlu / Tercih Edilen Alanlar */}
      {(selectedJob?.requiresDriverLicense || selectedJob?.requiresSRC || selectedJob?.requiresSecurityCard || selectedJob?.requiresPhysicalMeasurements) && (
        <section>
          <div className="border-b border-white/10 pb-4 mb-4">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Sektörel Gereklilikler
            </h2>
            <p className="text-sm text-base-content/60 mt-1">Seçtiğiniz unvan için İK'nın aradığı yasal ve fiziki şartlar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {selectedJob.requiresDriverLicense && (
              <div className="form-control p-4 bg-[#1e2329] rounded-xl border border-white/5">
                <label className="label"><span className="label-text text-white font-bold mb-1">Ehliyet Sınıfları</span></label>
                <div className="flex flex-wrap gap-2">
                  {['B', 'C', 'CE', 'D', 'E', 'G (İş Mak.)'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleDriverLicense(type)}
                      className={`btn btn-sm p-3 rounded-lg border-none ${formData.driverLicense.includes(type) ? 'bg-emerald-600 text-white' : 'bg-[#0f1115] text-base-content/70 hover:bg-white/10'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedJob.requiresSRC && (
              <div className="form-control p-4 bg-[#1e2329] rounded-xl border border-white/5">
                <label className="label"><span className="label-text text-white font-bold mb-1">SRC ve Psikoteknik</span></label>
                <div className="flex flex-wrap gap-2">
                  {['SRC 1', 'SRC 2', 'SRC 3', 'SRC 4', 'Psikoteknik'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleSRC(type)}
                      className={`btn btn-sm p-2 rounded-lg border-none ${formData.srcDocument.includes(type) ? 'bg-amber-600 text-white' : 'bg-[#0f1115] text-base-content/70 hover:bg-white/10'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedJob.requiresPhysicalMeasurements && (
              <div className="form-control md:col-span-2 grid grid-cols-2 gap-4 p-4 bg-[#1e2329] rounded-xl border border-white/5">
                <div>
                  <label className="label"><span className="label-text text-white font-bold">Boy (cm)</span></label>
                  <input type="number" placeholder="180" value={formData.height} onChange={e => updateFormData({ height: e.target.value })} className="input input-sm p-2 input-bordered w-full bg-[#0f1115] border-white/10 text-white" />
                </div>
                <div>
                  <label className="label"><span className="label-text text-white font-bold">Kilo (kg)</span></label>
                  <input type="number" placeholder="80" value={formData.weight} onChange={e => updateFormData({ weight: e.target.value })} className="input input-sm p-2 input-bordered w-full bg-[#0f1115] border-white/10 text-white" />
                </div>
              </div>
            )}

            {selectedJob.requiresSecurityCard && (
              <div className="form-control p-4 bg-[#1e2329] rounded-xl border border-white/5">
                <label className="label"><span className="label-text text-white font-bold">ÖGG Kimlik Türü</span></label>
                <select value={formData.securityCardType} onChange={e => updateFormData({ securityCardType: e.target.value as any })} className="select select-sm p-2 select-bordered w-full bg-[#0f1115] border-white/10 text-white">
                  <option value="">Seçiniz</option>
                  <option value="Silahlı">Silahlı ÖGG</option>
                  <option value="Silahsız">Silahsız ÖGG</option>
                </select>
              </div>
            )}
          </div>
        </section>
      )}


      {/* REFERANSLAR */}
      <section className="pt-4 border-t border-white/5">
        <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Referanslar (Opsiyonel)
            </h2>
            <p className="text-sm text-base-content/60 mt-1">Eski yöneticilerinizden veya ustalarınızdan referans ekleyebilirsiniz. (Max 2)</p>
          </div>
          {(formData.references || []).length < 2 && (
            <button onClick={handleAddReference} className="btn btn-sm p-2 btn-outline border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white">
              <Plus className="w-4 h-4 mr-1" /> Ekle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(formData.references || []).length === 0 ? (
            <div className="text-center py-6 bg-[#0f1115] border border-dashed border-white/10 rounded-xl">
              <p className="text-base-content/50 text-sm mb-2">Henüz referans eklemediniz.</p>
              <button onClick={handleAddReference} className="btn btn-sm p-3 border-none bg-white/5 hover:bg-white/10 text-white">
                <Plus className="w-4 h-4 mr-1" /> İlk Referansı Ekle
              </button>
            </div>
          ) : (
            (formData.references || []).map((ref, index) => (
              <div key={ref.id} className="p-4 bg-[#1e2329] rounded-xl border border-white/5 relative">
                <button
                  onClick={() => handleRemoveReference(ref.id)}
                  className="absolute top-3 right-3 text-base-content/40 hover:text-red-400 transition-colors p-1"
                  title="Referansı Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wider">{index + 1}. Referans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Ad Soyad *</span></label>
                    <input type="text" value={ref.fullName} onChange={e => handleUpdateReference(ref.id, 'fullName', e.target.value)} placeholder="Örn: Ahmet Yılmaz" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Kurum & Ünvan *</span></label>
                    <input type="text" value={ref.companyAndTitle} onChange={e => handleUpdateReference(ref.id, 'companyAndTitle', e.target.value)} placeholder="Örn: Ford / Vardiya Amiri" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text text-white text-xs">Telefon No</span></label>
                    <input type="tel" value={ref.phone} onChange={e => handleUpdateReference(ref.id, 'phone', e.target.value)} placeholder="Örn: 05XX XXX XX XX" className="input p-3 w-full input-bordered bg-[#0f1115] border-white/10 text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* GENEL EK BİLGİLER */}
      <section className="pt-4 border-t border-white/5">
        <div className="border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-400" />
            Ek Bilgiler & Son Dokunuşlar
          </h2>
          <p className="text-sm text-base-content/60 mt-1">Bu ufak detaylar İK'nın karar verme sürecini doğrudan etkiler.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label"><span className="label-text text-white">Vardiya / Çalışma Düzeni Tercihi</span></label>
            <select value={formData.shiftPreference} onChange={e => updateFormData({ shiftPreference: e.target.value as CVFormData['shiftPreference'] })} className="select select-bordered p-2 bg-[#0f1115] border-white/10 text-white w-full">
              <option value="">Seçiniz</option>
              <option value="Sabit Gündüz">Sabit Gündüz</option>
              <option value="Sabit Gece">Sabit Gece</option>
              <option value="3'lü Vardiya (08-16 / 16-24 / 24-08)">3'lü Vardiya (08-16 / 16-24 / 24-08)</option>
              <option value="2'li Vardiya (12 Saatlik)">2'li Vardiya (12 Saatlik)</option>
              <option value="24/48 Sistemi (Güvenlik/Sağlık)">24/48 Sistemi (Güvenlik/Sağlık)</option>
              <option value="Farketmez / Esnek">Farketmez / Esnek</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-white">Askerlik Durumu</span></label>
            <select value={formData.militaryStatus} onChange={e => updateFormData({ militaryStatus: e.target.value as any })} className="select select-bordered p-2 bg-[#0f1115] border-white/10 text-white w-full">
              <option value="">Seçiniz</option>
              <option value="Yapıldı">Yapıldı</option>
              <option value="Tecilli">Tecilli</option>
              <option value="Muaf">Muaf</option>
              <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-white">İşe Ulaşım Planı</span></label>
            <select value={formData.commutePreference} onChange={e => updateFormData({ commutePreference: e.target.value as any })} className="select select-bordered p-2 bg-[#0f1115] border-white/10 text-white w-full">
              <option value="">Seçiniz</option>
              <option value="Kendi aracım var">Kendi aracım var</option>
              <option value="Servis / Toplu taşıma">Servis / Toplu taşıma</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text text-white">Sigara Kullanımı (Opsiyonel)</span></label>
            <select value={formData.smoking} onChange={e => updateFormData({ smoking: e.target.value as any })} className="select select-bordered p-2 bg-[#0f1115] border-white/10 text-white w-full">
              <option value="">Seçiniz</option>
              <option value="Kullanmıyorum">Kullanmıyorum</option>
              <option value="Kullanıyorum">Kullanıyorum</option>
              <option value="Belirtmek İstemiyorum">Belirtmek İstemiyorum</option>
            </select>
          </div>
        </div>
      </section>

      {/* FOTOĞRAF EKLEME (OPSİYONEL) */}
      <section className="pt-8 border-t border-white/5">
        <div className="border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            Profil Fotoğrafı (Opsiyonel)
          </h2>
          <p className="text-sm text-base-content/60 mt-1">Sadece Atölye CV formatında sağ üstte görünür. PDF oluşturulurken kullanılır, hesabınızda kalıcı olarak saklanmaz.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#1e2329] rounded-xl border border-white/5">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="file-input file-input-bordered file-input-sm w-full max-w-xs bg-[#0f1115] border-white/10 text-white"
          />
          <div className="flex items-center gap-2">
            {isPhotoLoading && <span className="loading loading-spinner loading-sm text-indigo-400"></span>}
            {!isPhotoLoading && formData.photo && <span className="text-emerald-400 text-sm font-medium">✔ Fotoğraf eklendi.</span>}
            {formData.photo && !isPhotoLoading && (
              <button onClick={() => updateFormData({ photo: '' })} className="btn btn-xs btn-ghost text-red-400 hover:bg-red-900/20">
                Kaldır
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Navigasyon Butonları */}
      <div className="flex justify-between pt-6 border-t border-white/5 mt-8">
        <button onClick={prevStep} className="btn btn-ghost p-3 text-base-content/70 hover:text-white">
          <ChevronLeft className="w-5 h-5 mr-1" /> Geri Dön
        </button>
        <button disabled={isPhotoLoading} onClick={nextStep} className="btn border-none p-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50">
          PDF Önizleme & İndir <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

    </div>
  );
}

