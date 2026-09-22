export type SkillLevel = 'Öğreniyor' | 'Eğitim Düzeyi' | 'Tecrübeli' | 'Usta';

export type SkillCategory = 'Mesleki Bilgi' | 'Makine/Ekipman' | 'Sertifika/Belge' | 'Genel';

export interface CVSkill {
  name: string;
  category: SkillCategory;
}

export interface CVCareerSummaryTemplate {
  level: 'Çırak' | 'Kalfa' | 'Usta';
  text: string;
}

export interface CVJobTitle {
  id: string;
  name: string;
  suggestedSkills: CVSkill[];
  summaryTemplates: CVCareerSummaryTemplate[];
  // Dinamik alan gösterimi için bayraklar (Sektör bazlı edge-caseler)
  requiresDriverLicense?: boolean;
  requiresSRC?: boolean;
  requiresHeightWork?: boolean;
  requiresHygiene?: boolean;
  requiresSecurityCard?: boolean;
  requiresPhysicalMeasurements?: boolean;
}

export interface CVSector {
  id: string;
  name: string;
  jobTitles: CVJobTitle[];
}

export interface CVExperience {
  id: string;
  company: string;
  position: string;
  startDate: string; // MM/YYYY
  endDate: string; // MM/YYYY or "Devam Ediyor"
  description: string;
}

export interface CVEducation {
  id: string;
  level: 'İlkokul' | 'Ortaokul' | 'Lise' | 'Meslek Lisesi' | 'Ön Lisans' | 'Lisans' | 'Açıköğretim Ön Lisans' | 'Açıköğretim Lisans' | 'Çıraklık Eğitimi' | 'Mesleki Kurs (İŞKUR vb.)';
  schoolName: string;
  department?: string;
  startDate: string; // YYYY veya MM/YYYY
  endDate: string; // YYYY veya "Devam Ediyor"
}

export interface CVReference {
  id: string;
  fullName: string;
  companyAndTitle: string;
  phone: string;
}

export interface CVFormData {
  // Adım 1: Kişisel Bilgiler
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  photo?: string; // Base64 Data URL (PDF için)
  birthDate?: string;
  
  // Yasal / Saha (Opsiyonel Mavi Yaka Alanları)
  driverLicense: string[]; // Örn: ['B', 'E']
  srcDocument: string[]; // Örn: ['SRC 3', 'SRC 4']
  militaryStatus: 'Yapıldı' | 'Tecilli' | 'Muaf' | 'Belirtmek İstemiyorum' | '';
  
  // Adım 2: Meslek & Kariyer Özeti
  sectorId: string;
  jobTitleName: string;
  summary: string;
  availability: 'Hemen Başlayabilir' | '15 Gün İçinde' | '1 Ay İçinde' | 'İhbar Süresi Var' | '';

  // Adım 3: Çalışma Disiplini (Özel Gövde Gösterisi Alanı)
  disciplineShifts: boolean;
  discipline5S: boolean;
  disciplineISG: boolean;
  disciplineHeavy: boolean;

  // Adım 4: Yetenekler & Makine Parkuru
  selectedSkills: { name: string; level?: SkillLevel; category: SkillCategory }[];
  customSkills: { name: string; level?: SkillLevel; category: SkillCategory }[];

  // Adım 5: Deneyim (Max 3 adet kuralı arayüzde uygulanacak)
  experiences: CVExperience[];

  // Adım 6: Eğitim (Mesleki Kurslar öncelikli)
  educations: CVEducation[];

  // Adım 7: Referanslar (Max 2)
  references: CVReference[];

  // Sektöre Özel Ekstra Alanlar (Güvenlik vb. için)
  height?: string; // Boy cm
  weight?: string; // Kilo kg
  securityCardType?: 'Silahlı' | 'Silahsız' | '';

  // Ek Bilgiler
  commutePreference: 'Kendi aracım var' | 'Servis / Toplu taşıma' | '';
  smoking: 'Kullanmıyorum' | 'Kullanıyorum' | 'Belirtmek İstemiyorum' | '';
  shiftPreference: 'Gündüz' | 'Gece' | 'Farketmez' | '';
  travelRestriction: 'Şehir dışı engelim yok' | 'Sadece şehir içi' | '';
}

