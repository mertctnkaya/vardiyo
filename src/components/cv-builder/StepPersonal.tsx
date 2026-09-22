import React from 'react';
import { useCVStore } from '../../store/useCVStore';
import { User, ChevronRight } from 'lucide-react';
import locationsData from '../../constants/locations.json';

export default function StepPersonal() {
  const { formData, updateFormData, nextStep } = useCVStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
    // Eğer il değişirse ilçeyi sıfırla
    if (e.target.name === 'city') {
      updateFormData({ district: '' });
    }
  };

  const isComplete = formData.firstName.length > 2 && formData.lastName.length > 2 && formData.phone.length > 9;

  // Seçili ile göre ilçeleri bul
  const selectedCityData = locationsData.find(loc => loc.il.toLowerCase() === formData.city.toLowerCase());
  const districts = selectedCityData ? selectedCityData.ilceleri : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Kişisel Bilgiler
        </h2>
        <p className="text-sm text-base-content/60 mt-1">İletişim bilgileriniz İK uzmanlarının size ulaşması için en kritik alandır.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ad */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Adınız *</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Örn: Mertcan"
            className="input input-bordered w-full p-2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
          />
        </div>

        {/* Soyad */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Soyadınız *</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Örn: Çetinkaya"
            className="input input-bordered w-full p-2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
          />
        </div>

        {/* Telefon */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">Telefon Numarası *</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Örn: 0555 555 5555"
            className="input input-bordered w-full p-2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
            pattern="[0-9\s]*"
            title="Sadece rakam ve boşluk kullanın."
          />
        </div>

        {/* E-posta */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">E-posta Adresi</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="adres@ornek.com"
            className="input input-bordered w-full p-2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
            pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"
          />
        </div>
      </div>

      {/* Şehir ve İlçe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">İkamet Edilen İl</span>
          </label>
          <input
            type="text"
            name="city"
            list="cities"
            value={formData.city}
            onChange={handleChange}
            placeholder="Örn: İstanbul"
            className="input input-bordered w-full p-2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
            autoComplete="off"
          />
          <datalist id="cities">
            {locationsData.map(loc => (
              <option key={loc.il} value={loc.il} />
            ))}
          </datalist>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-white">İlçe</span>
          </label>
          <input
            type="text"
            name="district"
            list="districts"
            value={formData.district}
            onChange={handleChange}
            placeholder={districts.length > 0 ? "İlçe seçin" : "Önce il seçin"}
            className="input input-bordered w-full p-2 bg-[#0f1115] border-white/10 focus:border-indigo-500 text-white"
            disabled={!formData.city}
            autoComplete="off"
          />
          <datalist id="districts">
            {districts.map(dist => (
              <option key={dist} value={dist} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-white/5 mt-8">
        <button
          onClick={nextStep}
          disabled={!isComplete}
          className="btn border-none p-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sonraki Adım (Meslek)
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}

