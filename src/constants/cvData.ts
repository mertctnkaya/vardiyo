import type { CVSector } from '../types/cv';

export const CV_DATA: CVSector[] = [
  {
    id: 'uretim-sanayi',
    name: 'Üretim & Sanayi',
    jobTitles: [
      {
        id: 'cnc-operatoru',
        name: 'CNC Operatörü',
        requiresPhysicalMeasurements: false,
        suggestedSkills: [
          { name: 'Teknik Resim Okuma', category: 'Mesleki Bilgi' },
          { name: 'Kumpas ve Mikrometre', category: 'Makine/Ekipman' },
          { name: 'G-Code', category: 'Mesleki Bilgi' },
          { name: 'Fanuc Ünite', category: 'Makine/Ekipman' },
          { name: 'Siemens Ünite', category: 'Makine/Ekipman' },
          { name: 'Parça Bağlama & Sıfırlama', category: 'Mesleki Bilgi' },
          { name: 'Talaşlı İmalat Prensipleri', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Talaşlı imalat ve CNC tezgâh operasyonlarını atölye ortamında sıfırdan öğrenmek ve meslekte ustalaşmak isteyen çırak adayı. Atölye düzenine uyumlu, öğrenmeye açık, uzun vadeli yetiştirilmek üzere çalışmaya hazırdır.' },
          { level: 'Kalfa', text: 'CNC Torna ve Freze tezgahlarında temel ayarları yapabilen, parça bağlama ve takım sıfırlama süreçlerine hakim operatör. 5S ve İSG kurallarına uygun, vardiyalı seri üretim temposunda görev alabilir.' },
          { level: 'Usta', text: 'Yılların getirdiği talaşlı imalat tecrübesiyle, karmaşık teknik resimleri okuyabilen, bağımsız program yazabilen ve tezgah ayarlarını optimize ederek üretim firesini minimize eden usta CNC operatörü.' }
        ]
      },
      {
        id: 'pres-operatoru',
        name: 'Pres Operatörü',
        suggestedSkills: [
          { name: 'Abkant Pres', category: 'Makine/Ekipman' },
          { name: 'Eksantrik Pres', category: 'Makine/Ekipman' },
          { name: 'Hidrolik Pres', category: 'Makine/Ekipman' },
          { name: 'Kalıp Değiştirme', category: 'Mesleki Bilgi' },
          { name: 'Sac Şekillendirme', category: 'Mesleki Bilgi' },
          { name: 'Çift El Buton Kullanımı', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Pres ve metal şekillendirme hattında çalışmaya istekli, ağır sanayi temposuna ve vardiyalı çalışmaya ayak uydurabilecek, iş güvenliği kurallarını her şeyin üstünde tutan yetiştirilmek üzere operatör adayı.' },
          { level: 'Kalfa', text: 'Seri üretim pres hatlarında tecrübeli, temel kalıp sök-tak işlemlerine yardımcı olabilen, çıkan parçaların ilk görsel kalite kontrolünü yapabilen disiplinli pres operatörü.' },
          { level: 'Usta', text: 'Abkant ve eksantrik preslerde uzmanlaşmış, büküm açılarını ve kalıp ayarlarını milimetrik hassasiyetle yapabilen, üretim hattındaki arızalara anında müdahale edebilen deneyimli pres ustası.' }
        ]
      },
      {
        id: 'kaynakci',
        name: 'Kaynak Ustası / Operatörü',
        suggestedSkills: [
          { name: 'TIG (Argon) Kaynağı', category: 'Makine/Ekipman' },
          { name: 'MIG/MAG (Gazaltı) Kaynağı', category: 'Makine/Ekipman' },
          { name: 'Elektrod (Örtülü) Kaynak', category: 'Makine/Ekipman' },
          { name: 'Oksi-Asetilen', category: 'Makine/Ekipman' },
          { name: 'Çelik Konstrüksiyon', category: 'Mesleki Bilgi' },
          { name: 'Teknik Resim ve Kaynak Sembolleri', category: 'Mesleki Bilgi' },
          { name: 'MYK Kaynakçı Belgesi', category: 'Sertifika/Belge' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Kaynak atölyesinde temel iş güvenliği ve parça hazırlama süreçlerini kavramış, kaynakçılık mesleğini usta-çırak ilişkisiyle öğrenmeye hevesli, taşlama ve cüruf temizliğinde dikkatli çırak adayı.' },
          { level: 'Kalfa', text: 'Gazaltı ve örtülü elektrod kaynağında pratik tecrübeye sahip, çelik konstrüksiyon montajlarında aktif görev alabilen, teknik resimlere uygun standart kaynak çekebilen kaynak operatörü.' },
          { level: 'Usta', text: 'TIG (Argon) ve Gazaltı kaynağında uzman, röntgenlik (tahribatsız muayeneden geçecek) seviyede hassas ve sızdırmaz kaynak dikişleri atabilen, MYK belgeli deneyimli kaynak ustası.' }
        ]
      },
      {
        id: 'uretim-iscisi',
        name: 'Üretim / Montaj İşçisi',
        suggestedSkills: [
          { name: 'Montaj Hattı', category: 'Mesleki Bilgi' },
          { name: 'Bant Sistemi (Seri Üretim)', category: 'Mesleki Bilgi' },
          { name: 'Havalı El Aletleri (Vidalama vb.)', category: 'Makine/Ekipman' },
          { name: 'Paketleme ve Etiketleme', category: 'Mesleki Bilgi' },
          { name: 'Görsel Kalite Kontrol', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Fabrika ortamında çalışmaya istekli, vardiyalı sisteme tam uyum sağlayabilen, el becerisi yüksek ve bant usulü seri üretime yatkın üretim personeli.' },
          { level: 'Kalfa', text: 'Seri üretim ve montaj hatlarında tecrübeli, havalı/elektrikli el aletlerini hızlı ve güvenli kullanabilen, takım çalışmasına yatkın montaj operatörü.' },
          { level: 'Usta', text: 'Üretim hattında uzun yıllar görev almış, montaj süreçlerindeki darboğazları görüp çözebilen, yeni başlayan personeli eğitebilen hat sorumlusu/usta pozisyonuna uygun tecrübeli eleman.' }
        ]
      },
      {
        id: 'bakim-onarim',
        name: 'Bakım Onarım Personeli',
        suggestedSkills: [
          { name: 'Mekanik Bakım', category: 'Mesleki Bilgi' },
          { name: 'Elektrik & Pnömatik Sistemler', category: 'Mesleki Bilgi' },
          { name: 'Kestirimci Bakım', category: 'Mesleki Bilgi' },
          { name: 'Rulman & Kayış Değişimi', category: 'Makine/Ekipman' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Mekanik ve elektrik sistemlerine meraklı, bakım atölyesinde usta yanında pratik yaparak mesleği öğrenecek istekli çırak adayı.' },
          { level: 'Kalfa', text: 'Rutin periyodik bakımları yapabilen, temel mekanik arızaları tespit edip parça değişimi gerçekleştirebilen bakım personeli.' },
          { level: 'Usta', text: 'Fabrika makine parkurunun tüm mekanik, pnömatik ve hidrolik arızalarına anında müdahale edebilen, duruş sürelerini minimize eden usta bakımcı.' }
        ]
      },
      {
        id: 'gemi-yat-imalat',
        name: 'Tersane / Gemi-Yat İmalat Ustası',
        suggestedSkills: [
          { name: 'Fiberglass / Kompozit İşçiliği', category: 'Mesleki Bilgi' },
          { name: 'Çelik Sac Şekillendirme', category: 'Mesleki Bilgi' },
          { name: 'Tekne Gövde Montajı', category: 'Mesleki Bilgi' },
          { name: 'Tersane İş Güvenliği (İSG)', category: 'Sertifika/Belge' },
          { name: 'Argon (TIG) Alüminyum Kaynağı', category: 'Makine/Ekipman' },
          { name: 'Zımpara ve Taşlama', category: 'Makine/Ekipman' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Tersane ve tekne/yat üretim sahalarında ağır iş temposuna uyum sağlayabilecek, tekne kalıp temizleme, zımpara ve taşlama işlerinde ustalarına destek olacak çırak.' },
          { level: 'Kalfa', text: 'Gemi ve yat imalatında gövde hazırlama, fiberglass dökümü ve kaynak hazırlık işlemlerini yürütebilen, tersane ortamına alışkın kalfa seviyesi personel.' },
          { level: 'Usta', text: 'Gemi sacı ve lüks yat (kompozit/ahşap) gövde imalatında projeyi sıfırdan son aşamaya kadar yürütebilen, teknik projeleri okuyarak kusursuz iş çıkartan uzman ustabaşı.' }
        ]
      }
    ]
  },
  {
    id: 'lojistik-depo',
    name: 'Lojistik & Taşıma',
    jobTitles: [
      {
        id: 'depo-iscisi',
        name: 'Depo İşçisi',
        requiresDriverLicense: true,
        suggestedSkills: [
          { name: 'Mal Kabul ve Sayım', category: 'Mesleki Bilgi' },
          { name: 'Paketleme ve Streçleme', category: 'Mesleki Bilgi' },
          { name: 'Transpalet Kullanımı', category: 'Makine/Ekipman' },
          { name: 'Koli Taşıma / Fiziksel Yeterlilik', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Depo ve lojistik ortamında yetiştirilmek üzere, fiziksel çalışma temposuna ayak uydurabilecek, takım çalışmasına yatkın ve disiplinli depo personeli.' },
          { level: 'Kalfa', text: 'Mal kabul, sayım ve sevkiyat hazırlığı süreçlerinde tecrübeli, depo içi düzenlemelerde dikkatli, transpalet ile güvenli taşıma yapabilen depo işçisi.' },
          { level: 'Usta', text: 'Depo işleyişine tamamen hakim, yoğun dönemlerde operasyonu yönlendirebilen, sevkiyat hatalarını en aza indiren tecrübeli depo sorumlusu adayı.' }
        ]
      },
      {
        id: 'forklift-operatoru',
        name: 'Forklift Operatörü',
        requiresDriverLicense: true,
        suggestedSkills: [
          { name: 'Forklift Ehliyeti (G Sınıfı)', category: 'Sertifika/Belge' },
          { name: 'Dar Alan İstifleme', category: 'Mesleki Bilgi' },
          { name: 'Rampadan Yükleme/Boşaltma', category: 'Mesleki Bilgi' },
          { name: 'Elektrikli/Dizel Forklift', category: 'Makine/Ekipman' },
          { name: 'Reach Truck Kullanımı', category: 'Makine/Ekipman' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Forklift ehliyetini yeni almış, meslekte tecrübe kazanmak isteyen, depo kurallarına harfiyen uyan dikkatli operatör adayı.' },
          { level: 'Kalfa', text: 'Depo içi raflara güvenli yük kaldırma ve istifleme kurallarına hakim, tır yükleme-boşaltma yapabilen pratik forklift operatörü.' },
          { level: 'Usta', text: 'Reach Truck ve Ağır Tonajlı Forkliftleri milimetrik hassasiyetle kullanabilen, yüksek raflara ve dar koridorlara sıfır hata ile istifleme yapabilen uzman operatör.' }
        ]
      },
      {
        id: 'agir-vasita-soforu',
        name: 'Ağır Vasıta / Tır Şoförü',
        requiresDriverLicense: true,
        requiresSRC: true,
        suggestedSkills: [
          { name: 'CE Sınıfı Ehliyet', category: 'Sertifika/Belge' },
          { name: 'SRC 3/4 Belgesi', category: 'Sertifika/Belge' },
          { name: 'Psikoteknik Belgesi', category: 'Sertifika/Belge' },
          { name: 'Takograf Kullanımı ve Kuralları', category: 'Mesleki Bilgi' },
          { name: 'Rampa Yanaşma & Manevra', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Ağır vasıta ehliyetini ve SRC belgelerini yeni almış, lojistik sektöründe uzun yol veya şehir içi sevkiyat şoförü olarak kendini geliştirmek isteyen aday.' },
          { level: 'Kalfa', text: 'Yurt içi taşımacılık operasyonlarında tecrübeli, takograf kurallarına uyan ve aracının periyodik bakım takibini yapan güvenilir tır/kamyon şoförü.' },
          { level: 'Usta', text: 'Zorlu kış şartlarında ve uluslararası güzergahlarda yüksek tonajlı araçları güvenle sevk ve idare edebilen, sıfır kaza geçmişine sahip profesyonel ağır vasıta şoförü.' }
        ]
      },
      {
        id: 'moto-kurye',
        name: 'Moto Kurye / Kurye',
        requiresDriverLicense: true,
        suggestedSkills: [
          { name: 'A2 Sınıfı Ehliyet', category: 'Sertifika/Belge' },
          { name: 'Güvenli Sürüş Teknikleri', category: 'Mesleki Bilgi' },
          { name: 'Müşteri Memnuniyeti', category: 'Genel' },
          { name: 'Navigasyon / GPS Kullanımı', category: 'Makine/Ekipman' },
          { name: 'Zaman Yönetimi', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Motosiklet ehliyetini almış, trafik kurallarına harfiyen uyan, paket teslimat işini hızlı ve güvenli yapacak, adres bulma konusunda öğrenmeye açık kurye adayı.' },
          { level: 'Kalfa', text: 'Şehir içi lokasyonlara, restoran ve e-ticaret dağıtım süreçlerine hakim, müşteri iletişimine dikkat eden hızlı ve dikkatli moto kurye.' },
          { level: 'Usta', text: 'Yüksek performansla çalışan, iptal/iade süreçlerini pratik şekilde yöneten, motor bakımını kendisi takip eden profesyonel saha kuryesi.' }
        ]
      },
      {
        id: 'gemi-adami',
        name: 'Gemi Adamı / Kaptan / Yağcı',
        suggestedSkills: [
          { name: 'Gemi Adamı Cüzdanı', category: 'Sertifika/Belge' },
          { name: 'STCW Temel Eğitim Sertifikaları', category: 'Sertifika/Belge' },
          { name: 'Makine Bakım (Yağcı)', category: 'Mesleki Bilgi' },
          { name: 'Güverte Donanım ve Manevra', category: 'Mesleki Bilgi' },
          { name: 'Vardiya Zabiti', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Gemi adamı cüzdanı ve temel STCW belgeleri tam, denizcilik sektöründe kariyer hedefleyen miço veya silici pozisyonu için öğrenmeye açık gemici adayı.' },
          { level: 'Kalfa', text: 'Açık deniz veya kabotaj hattı tecrübesine sahip, makine dairesi rutinlerini (yağcı) bilen veya güverte işleyişine tamamen hakim disiplinli gemi personeli.' },
          { level: 'Usta', text: 'Yılların açık deniz tecrübesine sahip, kriz anlarında gemi sevk ve idaresini sorunsuz yürüten, mürettebatı sevk eden deneyimli kaptan veya usta makinist.' }
        ]
      }
    ]
  },
  {
    id: 'insaat-tesisat',
    name: 'İnşaat & Tesisat',
    jobTitles: [
      {
        id: 'insaat-ustasi',
        name: 'İnşaat Ustası (Kalıp/Demir/Duvar)',
        requiresHeightWork: true,
        suggestedSkills: [
          { name: 'Beton Kalıp Çakma', category: 'Mesleki Bilgi' },
          { name: 'Tuğla ve BIMS Örme', category: 'Mesleki Bilgi' },
          { name: 'İnşaat Demiri Bağlama', category: 'Mesleki Bilgi' },
          { name: 'Lazer Terazi Kullanımı', category: 'Makine/Ekipman' },
          { name: 'Proje Okuma', category: 'Mesleki Bilgi' },
          { name: 'Şantiye İSG Kuralları', category: 'Sertifika/Belge' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Şantiyede usta yanında çalışarak inşaat işlerini temelden öğrenmek isteyen, ağır fiziksel koşullara uyumlu çırak.' },
          { level: 'Kalfa', text: 'Kalıp çakma, demir bağlama veya duvar örme süreçlerinde ustaya destek olabilen, bağımsız iş alabilecek seviyeye yaklaşmış kalfa.' },
          { level: 'Usta', text: 'Mimari ve statik projelere uygun olarak kalıp, demir ve duvar işlerini sıfır hatayla teslim eden, şantiye yönetebilen deneyimli inşaat ustası.' }
        ]
      },
      {
        id: 'elektrik-tesisat',
        name: 'Elektrik Tesisat Ustası',
        requiresHeightWork: true,
        suggestedSkills: [
          { name: 'Kablo Çekimi ve Tava Montajı', category: 'Mesleki Bilgi' },
          { name: 'Pano Montajı', category: 'Makine/Ekipman' },
          { name: 'Zayıf & Kuvvetli Akım Sistemleri', category: 'Mesleki Bilgi' },
          { name: 'Multimetre & Test Cihazları', category: 'Makine/Ekipman' },
          { name: 'EKAT Belgesi', category: 'Sertifika/Belge' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Elektrik tesisat işlerine meraklı, iş güvenliğine azami dikkat eden, kablo çekimi ve montaj işlerinde usta yanında kendini geliştirecek çırak.' },
          { level: 'Kalfa', text: 'Priz-anahtar montajı, aydınlatma tesisatı ve temel pano bağlantılarını projeye uygun olarak yapabilen elektrik kalfası.' },
          { level: 'Usta', text: 'Bina, fabrika veya akıllı ev sistemlerinin tüm kuvvetli/zayıf akım elektrik projelerini hatasız devreye alabilen ustabaşı.' }
        ]
      },
      {
        id: 'boya-siva-ustasi',
        name: 'Boya / Sıva Ustası',
        requiresHeightWork: true,
        suggestedSkills: [
          { name: 'İç & Dış Cephe Boya', category: 'Mesleki Bilgi' },
          { name: 'Alçıpan & Kartonpiyer', category: 'Mesleki Bilgi' },
          { name: 'Saten Alçı ve Zımpara', category: 'Mesleki Bilgi' },
          { name: 'Dış Cephe Mantolama', category: 'Mesleki Bilgi' },
          { name: 'İskele Kurulumu', category: 'Makine/Ekipman' },
          { name: 'Airless Boya Makinesi', category: 'Makine/Ekipman' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Şantiye ve ev boya işlerinde ustaya yardımcı olacak, bant çekme, zımpara ve temizlik süreçlerinde pratik kazanacak enerjik çırak.' },
          { level: 'Kalfa', text: 'Alçı çekme, zımpara ve kat boya atma işlerini temiz ve hızlı şekilde yapabilen, dış cephe iskelesinde güvenle çalışabilen kalfa.' },
          { level: 'Usta', text: 'Tüm yüzeylerde pürüzsüz boya, sıva, yalıtım (mantolama) ve dekoratif alçı işlerini garantili teslim eden boya/sıva ustası.' }
        ]
      },
      {
        id: 'dogalgaz-tesisatcisi',
        name: 'Doğalgaz & Sıhhi Tesisat Ustası',
        suggestedSkills: [
          { name: 'Doğalgaz Boru Kaynağı', category: 'Mesleki Bilgi' },
          { name: 'PPRC ve PVC Boru İşçiliği', category: 'Makine/Ekipman' },
          { name: 'Kombi & Petek Montajı', category: 'Mesleki Bilgi' },
          { name: 'Kaçak Test Pompası Kullanımı', category: 'Makine/Ekipman' },
          { name: 'MYK Doğalgaz Tesisatçısı Belgesi', category: 'Sertifika/Belge' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Su ve doğalgaz tesisatı süreçlerinde kullanılan aletleri öğrenmeye açık, kır-dök işlemlerinde yardımcı çırak.' },
          { level: 'Kalfa', text: 'Temel PPRC kaynak işlemlerini yapan, su kaçağı tespiti ve petek temizliği konularında tecrübeli tesisat kalfası.' },
          { level: 'Usta', text: 'Sıfırdan kombi ve doğalgaz proje tesisatını gaz açma standartlarına uygun döşeyen, kaçak tespitinde uzman tesisat ustası.' }
        ]
      }
    ]
  },
  {
    id: 'guvenlik',
    name: 'Güvenlik & Koruma',
    jobTitles: [
      {
        id: 'ozel-guvenlik',
        name: 'Özel Güvenlik Görevlisi (ÖGG)',
        requiresSecurityCard: true,
        requiresPhysicalMeasurements: true,
        suggestedSkills: [
          { name: 'ÖGG Kimlik Kartı', category: 'Sertifika/Belge' },
          { name: 'X-Ray ve CCTV Kullanımı', category: 'Makine/Ekipman' },
          { name: 'El Dedektörü', category: 'Makine/Ekipman' },
          { name: 'Devriye ve Gözetim', category: 'Mesleki Bilgi' },
          { name: 'Kriz Yönetimi / İlk Yardım', category: 'Mesleki Bilgi' },
          { name: 'Silah Kullanım Yeterliliği', category: 'Sertifika/Belge' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Özel güvenlik kimlik kartını yeni almış, talimatlara harfiyen uyan, gözlem yeteneği yüksek ve vardiyalı sisteme uyum sağlayacak güvenlik görevlisi adayı.' },
          { level: 'Kalfa', text: 'Fabrika, AVM veya site güvenliğinde tecrübeli, CCTV sistemlerini takip edebilen, giriş-çıkış kayıtlarını disiplinle tutan profesyonel ÖGG.' },
          { level: 'Usta', text: 'Büyük ölçekli tesislerde vardiya amirliği yapmış, kriz anlarında soğukkanlılıkla ekibi yöneten, VIP koruma seviyesinde tecrübeye sahip güvenlik yöneticisi.' }
        ]
      }
    ]
  },
  {
    id: 'bilisim-yazilim',
    name: 'Bilişim & Yazılım',
    jobTitles: [
      {
        id: 'yazilim-uzmani',
        name: 'Yazılım Geliştirici / Uzmanı',
        suggestedSkills: [
          { name: 'Frontend (React, Vue, HTML/CSS)', category: 'Mesleki Bilgi' },
          { name: 'Backend (Node, C#, Python)', category: 'Mesleki Bilgi' },
          { name: 'Veritabanı (SQL, NoSQL)', category: 'Mesleki Bilgi' },
          { name: 'Git & Versiyon Kontrol (GitHub, GitLab)', category: 'Makine/Ekipman' },
          { name: 'REST API & Mikroservis', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Üniversite, bootcamp veya online eğitimlerini tamamlamış, modern yazılım teknolojilerinde kendini geliştirmeye hevesli Junior (Başlangıç seviyesi) Geliştirici.' },
          { level: 'Kalfa', text: 'Projelere aktif kod yazabilen, takım arkadaşlarıyla uyumlu, API entegrasyonu ve arayüz geliştirmeleri (Fullstack veya Backend/Frontend) yapabilen Mid-Level Geliştirici.' },
          { level: 'Usta', text: 'Sistem mimarisini sıfırdan kurabilen, temiz kod (Clean Code) prensiplerini uygulayan, CI/CD süreçlerine hakim ve ekibe liderlik edebilen Senior (Kıdemli) Geliştirici.' }
        ]
      },
      {
        id: 'it-destek',
        name: 'IT Destek / Teknik Servis',
        suggestedSkills: [
          { name: 'Bilgisayar Donanım Onarımı', category: 'Mesleki Bilgi' },
          { name: 'Windows / Linux Ağ Yönetimi', category: 'Mesleki Bilgi' },
          { name: 'Yazıcı & Çevre Birimleri Kurulumu', category: 'Makine/Ekipman' },
          { name: 'Active Directory / Office 365', category: 'Mesleki Bilgi' },
          { name: 'Helpdesk Yazılımları (Jira vb.)', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Bilgisayar sistemlerine meraklı, ofis içi donanım ve yazılım sorunlarını öğrenmeye açık, insan ilişkileri kuvvetli teknik destek adayı.' },
          { level: 'Kalfa', text: 'Kullanıcı sorunlarını (Helpdesk) hızlıca çözebilen, kablolu/kablosuz ağ kurulumu yapabilen, IP yapılandırmasına hakim tecrübeli IT destek elemanı.' },
          { level: 'Usta', text: 'Tüm şirket altyapısını, server (sunucu) sistemlerini yönetebilen, güvenlik duvarı kurallarını yazabilen ve veri güvenliğini sağlayan IT yöneticisi.' }
        ]
      }
    ]
  },
  {
    id: 'muhasebe-finans',
    name: 'Muhasebe & Finans',
    jobTitles: [
      {
        id: 'on-muhasebe',
        name: 'Ön Muhasebe Elemanı',
        suggestedSkills: [
          { name: 'Fatura ve İrsaliye Takibi', category: 'Mesleki Bilgi' },
          { name: 'Zirve / Logo / Mikro ERP', category: 'Makine/Ekipman' },
          { name: 'Cari Hesap ve Banka Mutabakatı', category: 'Mesleki Bilgi' },
          { name: 'MS Office (İleri Excel)', category: 'Makine/Ekipman' },
          { name: 'E-Fatura & E-Arşiv Süreçleri', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Ticaret lisesi veya ilgili bölüm mezunu, ofis programlarına hakim, muhasebe evraklarını dosyalamak ve veri girişi yapmak üzere yetiştirilecek ön muhasebe personeli.' },
          { level: 'Kalfa', text: 'Günlük fatura girişi, BA/BS formları, cari mutabakat ve e-fatura/e-arşiv süreçlerini hatasız yürüten disiplinli ön muhasebe sorumlusu.' },
          { level: 'Usta', text: 'Şirketin tüm finansal girdi-çıktısını ve nakit akışını yöneten, genel muhasebeye hazırlık raporlarını tek başına çıkarabilen deneyimli muhasebe uzmanı.' }
        ]
      },
      {
        id: 'banka-gise',
        name: 'Banka Gişe Personeli / Veznedar',
        suggestedSkills: [
          { name: 'Nakit İşlem Yönetimi', category: 'Mesleki Bilgi' },
          { name: 'Müşteri İlişkileri', category: 'Genel' },
          { name: 'Sahte Para ve Risk Kontrolü', category: 'Mesleki Bilgi' },
          { name: 'Banka Otomasyon Sistemleri', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Bankacılık veya finans bölümlerinden yeni mezun, iletişim becerisi kuvvetli, dikkati yüksek gişe asistanı adayı.' },
          { level: 'Kalfa', text: 'Para yatırma/çekme ve EFT/Havale operasyonlarını hızlı ve hatasız gerçekleştiren, müşteri memnuniyetini önde tutan deneyimli gişe memuru.' },
          { level: 'Usta', text: 'Gişe ve arka ofis (back-office) işlemlerini kusursuz yöneten, kredi ve ürün satış hedeflerini tutturan, mevzuata tam hakim tecrübeli banka personeli.' }
        ]
      }
    ]
  },
  {
    id: 'gida-hizmet',
    name: 'Gıda, Hizmet & Turizm',
    jobTitles: [
      {
        id: 'asci',
        name: 'Aşçı / Mutfak Personeli',
        requiresHygiene: true,
        suggestedSkills: [
          { name: 'Hijyen Belgesi', category: 'Sertifika/Belge' },
          { name: 'Toplu Yemek (Tabldot) Üretimi', category: 'Mesleki Bilgi' },
          { name: 'Sıcak & Soğuk Mutfak Deneyimi', category: 'Mesleki Bilgi' },
          { name: 'Endüstriyel Mutfak Ekipmanları', category: 'Makine/Ekipman' },
          { name: 'Menü Planlama ve Maliyet Hesabı', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Mutfakta bulaşık, doğrama veya hazırlık (komi) aşamalarında çalışarak aşçılığı meslek edinmek isteyen, yoğun mutfak temposuna ayak uyduracak personel.' },
          { level: 'Kalfa', text: 'Sıcak veya soğuk bölümde belirli reçeteleri başarıyla hazırlayabilen, mutfak hijyen kurallarına tam hakim ve şefine destek olan aşçı yardımcısı.' },
          { level: 'Usta', text: 'Toplu (catering) veya alakart restoran menülerini planlayan, maliyet kontrolü yapabilen ve tüm mutfak ekibini idare eden deneyimli Aşçıbaşı / Usta.' }
        ]
      },
      {
        id: 'garson',
        name: 'Garson / Komi / Barista',
        requiresHygiene: true,
        suggestedSkills: [
          { name: 'Sipariş ve Adisyon Yönetimi', category: 'Mesleki Bilgi' },
          { name: 'Espresso ve Kahve Makineleri', category: 'Makine/Ekipman' },
          { name: 'Güler Yüz ve İletişim', category: 'Genel' },
          { name: 'Hijyen Belgesi', category: 'Sertifika/Belge' },
          { name: 'Adisyon Yazılımları (Adisyo, vs.)', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Kafe ve restoran ortamında hızlı servis yapmaya yatkın, masa temizliği ve sunum destek işlerini öğrenmeye hevesli güler yüzlü komi adayı.' },
          { level: 'Kalfa', text: 'Müşteri siparişlerini eksiksiz alan, kahve çeşitlerini (Latte, Espresso vb.) chuẩn hazırlayabilen, POS sistemlerini kullanan tecrübeli garson / barista.' },
          { level: 'Usta', text: 'Tüm salon operasyonunu yönetebilen, zor müşterileri profesyonelce idare eden ve organizasyon/banket süreçlerini planlayan Salon Şefi / Head Barista.' }
        ]
      },
      {
        id: 'temizlik-gorevlisi',
        name: 'Temizlik Görevlisi',
        suggestedSkills: [
          { name: 'Endüstriyel Temizlik Makineleri (Zemin vb.)', category: 'Makine/Ekipman' },
          { name: 'Kimyasal Madde Kullanım Bilgisi', category: 'Mesleki Bilgi' },
          { name: 'Hijyen Kuralları', category: 'Mesleki Bilgi' },
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Ofis, okul veya fabrika alanlarında genel hijyen kurallarına uyarak titizlikle çalışacak temizlik personeli.' },
          { level: 'Kalfa', text: 'Zemin yıkama ve cilalama makinelerini kullanabilen, detaylı endüstriyel temizlik süreçlerini iyi bilen tecrübeli görevli.' },
          { level: 'Usta', text: 'Büyük tesislerin hijyen süreçlerini organize eden, temizlik ürünlerinin stok takibini yapan ve temizlik ekibine liderlik yapabilen meydancı / amir.' }
        ]
      }
    ]
  },
  {
    id: 'perakende-satis',
    name: 'Perakende & Satış',
    jobTitles: [
      {
        id: 'satis-danismani',
        name: 'Satış Danışmanı / Reyon Görevlisi',
        suggestedSkills: [
          { name: 'Mağaza ve Reyon Düzeni (Görsel Mağazacılık)', category: 'Mesleki Bilgi' },
          { name: 'İkna Kabiliyeti ve Müşteri İletişimi', category: 'Genel' },
          { name: 'POS ve Yazar Kasa Kullanımı', category: 'Makine/Ekipman' },
          { name: 'Stok ve Envanter Takibi', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Perakende mağazacılık sektöründe kariyer yapmak isteyen, müşteri odaklı, enerjik ve depodan reyona ürün taşıma/dizme işlerinde aktif çalışacak aday.' },
          { level: 'Kalfa', text: 'Müşteri taleplerini doğru analiz edip satışa dönüştüren, mağaza hedeflerine katkı sağlayan, kasa ve reyon süreçlerini eksiksiz yöneten tecrübeli satış danışmanı.' },
          { level: 'Usta', text: 'Müşteri şikayetlerini çözen, satış kotalarını aşan, depo/sayım süreçlerini organize eden ve mağaza ekibini yönlendiren tecrübeli mağaza müdür yardımcısı/müdürü.' }
        ]
      }
    ]
  }
  ,
  {
    id: 'saglik-hizmetleri',
    name: 'Sağlık Hizmetleri',
    jobTitles: [
      {
        id: 'hemsire',
        name: 'Hemşire / Sağlık Memuru',
        requiresHygiene: true,
        suggestedSkills: [
          { name: 'Damar Yolu Açma & Kan Alma', category: 'Mesleki Bilgi' },
          { name: 'Enjeksiyon (IM/IV)', category: 'Mesleki Bilgi' },
          { name: 'Hasta Takip ve Monitörizasyon', category: 'Makine/Ekipman' },
          { name: 'İlk Yardım / CPR', category: 'Sertifika/Belge' },
          { name: 'Hastane Bilgi Yönetim Sistemleri (HBYS)', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Sağlık meslek lisesi veya üniversite hemşirelik bölümünden yeni mezun, klinik işleyişine adapte olmak ve tecrübe kazanmak isteyen enerjik sağlık personeli.' },
          { level: 'Kalfa', text: 'Servis ve poliklinik süreçlerinde aktif görev almış, doktor direktiflerini eksiksiz uygulayan, hasta iletişimi kuvvetli ve acil durumlara müdahale edebilen tecrübeli hemşire.' },
          { level: 'Usta', text: 'Yoğun bakım, acil servis veya ameliyathane gibi kritik birimlerde uzun yıllar görev yapmış, nöbet süreçlerini yöneten, yeni personeli eğiten Sorumlu Hemşire / Başhemşire adayı.' }
        ]
      },
      {
        id: 'laborant',
        name: 'Tıbbi Laboratuvar Teknikeri',
        requiresHygiene: true,
        suggestedSkills: [
          { name: 'Biyokimya & Mikrobiyoloji Analizi', category: 'Mesleki Bilgi' },
          { name: 'Otoklav & Santrifüj Kullanımı', category: 'Makine/Ekipman' },
          { name: 'Kan Gruplama ve Cross-Match', category: 'Mesleki Bilgi' },
          { name: 'Laboratuvar Cihaz Kalibrasyonu', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Laboratuvar ortamında numune kabul ve tasnif süreçlerini öğrenen, analitik düşünceye sahip, dikkatli ve titiz stajyer/yeni mezun tekniker.' },
          { level: 'Kalfa', text: 'Kan, idrar ve doku numunelerini prosedürlere uygun olarak analiz cihazlarına yükleyen, sonuçları HBYS sistemine hatasız aktaran laborant.' },
          { level: 'Usta', text: 'Laboratuvar cihazlarının günlük kalibrasyon ve bakımlarını yapan, kompleks analiz sonuçlarını doğrulayan ve kalite kontrol süreçlerini yöneten kıdemli laboratuvar teknikeri.' }
        ]
      }
    ]
  },
  {
    id: 'tarim-hayvancilik',
    name: 'Tarım & Hayvancılık',
    jobTitles: [
      {
        id: 'veteriner-hekim',
        name: 'Veteriner Hekim / Tekniker',
        suggestedSkills: [
          { name: 'Hayvan Sağlığı ve Hastalıkları', category: 'Mesleki Bilgi' },
          { name: 'Ultrason ve Röntgen (Veteriner)', category: 'Makine/Ekipman' },
          { name: 'Cerrahi Operasyon Asistanlığı', category: 'Mesleki Bilgi' },
          { name: 'Aşılama ve Suni Tohumlama', category: 'Sertifika/Belge' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Veteriner kliniği veya çiftlik ortamında hayvan bakımı, zapturapt ve temel muayene hazırlıklarını yaparak mesleki tecrübe edinmek isteyen tekniker adayı.' },
          { level: 'Kalfa', text: 'Klinik aşı takvimlerini yöneten, kan alma ve laboratuvar testlerini yapan, pet veya büyükbaş hayvan hastalıklarında hekime asiste eden tecrübeli tekniker.' },
          { level: 'Usta', text: 'Klinik veya çiftlik operasyonlarını tek başına yürütebilen, teşhis ve tedavi protokollerine tam hakim, cerrahi operasyon tecrübesine sahip deneyimli veteriner hekim.' }
        ]
      },
      {
        id: 'sera-iscisi',
        name: 'Sera / Tarım İşçisi',
        suggestedSkills: [
          { name: 'Fide Dikimi ve Budama', category: 'Mesleki Bilgi' },
          { name: 'Damlama Sulama Sistemleri', category: 'Makine/Ekipman' },
          { name: 'Zirai İlaçlama ve Gübreleme', category: 'Mesleki Bilgi' },
          { name: 'Hasat ve Paketleme', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Açık arazi veya sera ortamında çalışmaya fiziksel olarak uygun, ekim, çapalama ve hasat işlerinde tecrübe kazanmak isteyen tarım personeli.' },
          { level: 'Kalfa', text: 'Bitki hastalıklarını temel düzeyde tanıyan, sulama motorlarını ve gübreleme sistemlerini kullanabilen, mevsimlik tarım takvimine hakim sera işçisi.' },
          { level: 'Usta', text: 'Büyük ölçekli seraların iklimlendirme ve sulama otomasyonlarını yöneten, ürün rekoltesini artıracak zirai teknikleri uygulayabilen tecrübeli tarım/sera ustabaşı.' }
        ]
      }
    ]
  },
  {
    id: 'enerji-dogal-kaynaklar',
    name: 'Enerji & Doğal Kaynaklar',
    jobTitles: [
      {
        id: 'ges-res-teknisyeni',
        name: 'GES / RES Bakım Teknisyeni',
        requiresHeightWork: true,
        suggestedSkills: [
          { name: 'Güneş Paneli (PV) Montajı', category: 'Mesleki Bilgi' },
          { name: 'İnvertör ve DC Pano Bağlantıları', category: 'Makine/Ekipman' },
          { name: 'Rüzgar Türbini Mekanik Bakımı', category: 'Mesleki Bilgi' },
          { name: 'Yüksekte Çalışma Belgesi', category: 'Sertifika/Belge' },
          { name: 'Termal Kamera ile Arıza Tespiti', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Yenilenebilir enerji sektörüne ilgi duyan, açık arazide ve yüksekte çalışmaya engeli olmayan, güneş/rüzgar santrallerinde montaj süreçlerini öğrenecek teknisyen adayı.' },
          { level: 'Kalfa', text: 'GES sahalarında kablo çekimi, panel değişimi ve invertör arızalarına ilk müdahaleyi yapabilen, elektriksel ölçümleri standartlara uygun gerçekleştiren teknisyen.' },
          { level: 'Usta', text: 'Büyük ölçekli enerji santrallerinin periyodik (kestirimci) bakımlarını planlayan, SCADA üzerinden sistem takibi yapıp kronik arızaları çözen uzman enerji teknikeri.' }
        ]
      },
      {
        id: 'sondaj-petrol',
        name: 'Sondaj İşçisi / Petrol Teknikeri',
        requiresHeightWork: true,
        suggestedSkills: [
          { name: 'Kuyu İçi Operasyonlar (Wireline)', category: 'Mesleki Bilgi' },
          { name: 'Sondaj Kulesi (Derrick) Operasyonları', category: 'Makine/Ekipman' },
          { name: 'Çamur Sistemleri (Mud System)', category: 'Mesleki Bilgi' },
          { name: 'Ağır İş Makinesi ve Vinç Kullanımı', category: 'Makine/Ekipman' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Sondaj kulesi ortamında ağır fiziksel ve vardiyalı (rig) çalışma koşullarına dayanıklı, iş güvenliği (HSE) kurallarına sıkı sıkıya uyan roustabout (düz işçi) adayı.' },
          { level: 'Kalfa', text: 'Sondaj borusu bağlama (roughneck) ve kuyu başı ekipman montaj işlemlerinde tecrübeli, çamur motoru dinamiklerini anlayan disiplinli petrol sahası çalışanı.' },
          { level: 'Usta', text: 'Tüm sondaj kulesi operasyonunu yönlendiren, kuyu kontrol (BOP) sistemlerine hakim, driller (sondör) pozisyonunda görev yapabilen yüksek tecrübeli uzman.' }
        ]
      }
    ]
  },
  {
    id: 'kimya-arge',
    name: 'Kimya & Ar-Ge',
    jobTitles: [
      {
        id: 'kimya-teknikeri',
        name: 'Kimya Teknikeri / Formülasyon Uzmanı',
        requiresHygiene: true,
        suggestedSkills: [
          { name: 'Titrasyon ve Çözelti Hazırlama', category: 'Mesleki Bilgi' },
          { name: 'HPLC, GC ve Spektrofotometre', category: 'Makine/Ekipman' },
          { name: 'MSDS (Malzeme Güvenlik) Kuralları', category: 'Mesleki Bilgi' },
          { name: 'Hammadde Giriş Kalite Kontrolü (IQC)', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Kimya endüstrisinde laboratuvar ve üretim sahası güvenliğini öğrenerek, temel numune alma ve pH/viskozite ölçüm işlemlerinde görev alacak tekniker adayı.' },
          { level: 'Kalfa', text: 'Üretimden gelen numunelerin rutin spektroskopik ve kromatografik analizlerini yapabilen, standart reaktifleri prosedürlere (SOP) göre hazırlayan deneyimli laborant.' },
          { level: 'Usta', text: 'Yeni ürün formülasyonları geliştiren, Ar-Ge projelerini yürüten ve üretim hattındaki kimyasal proses hatalarını kök-neden analiziyle çözen kıdemli kimya uzmanı.' }
        ]
      }
    ]
  },
  {
    id: 'medya-tasarim',
    name: 'Medya, Tasarım & İletişim',
    jobTitles: [
      {
        id: 'grafik-tasarim',
        name: 'Grafik Tasarımcı / Video Editör',
        suggestedSkills: [
          { name: 'Adobe Photoshop & Illustrator', category: 'Makine/Ekipman' },
          { name: 'Premiere Pro & After Effects', category: 'Makine/Ekipman' },
          { name: 'Renk Teorisi ve Tipografi', category: 'Mesleki Bilgi' },
          { name: 'Sosyal Medya Görsel Formatları', category: 'Mesleki Bilgi' },
          { name: 'UI/UX Temel Prensipleri', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Tasarım programlarını kullanmayı bilen, trendleri yakından takip eden, ajans veya kurum bünyesinde sosyal medya postları hazırlayarak portfolyosunu geliştirecek Junior tasarımcı.' },
          { level: 'Kalfa', text: 'Verilen brief doğrultusunda basılı ve dijital materyalleri (katalog, afiş, video kurgu) bağımsız olarak üretebilen, marka kimliğine sadık Mid-Level görsel iletişim uzmanı.' },
          { level: 'Usta', text: 'Kreatif konseptleri sıfırdan yaratan, kampanyaların sanat yönetmenliğini (Art Direction) üstlenen ve kompleks animasyon/VFX süreçlerini yöneten Senior Tasarımcı.' }
        ]
      },
      {
        id: 'sosyal-medya',
        name: 'Sosyal Medya & Reklam Uzmanı',
        suggestedSkills: [
          { name: 'Meta (Facebook/Instagram) Ads', category: 'Makine/Ekipman' },
          { name: 'Google Ads & Analytics', category: 'Makine/Ekipman' },
          { name: 'İçerik Stratejisi ve Metin Yazarlığı', category: 'Mesleki Bilgi' },
          { name: 'SEO (Arama Motoru Optimizasyonu)', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Dijital pazarlamaya ilgi duyan, içerik takvimi oluşturma ve topluluk yönetimi (yorum/mesaj yanıtlama) konularında yetiştirilecek sosyal medya asistanı.' },
          { level: 'Kalfa', text: 'Reklam kampanyalarını (PPC) kurup optimize edebilen, hedef kitle analizleri yaparak marka etkileşimini (engagement) artıran dijital pazarlama uzmanı.' },
          { level: 'Usta', text: 'Şirketin tüm dijital pazarlama bütçesini yöneten, performans odaklı (ROI/ROAS) veri analizi yapan ve büyüme stratejilerini (Growth Hacking) kurgulayan pazarlama yöneticisi.' }
        ]
      }
    ]
  },
  {
    id: 'hukuk-kamu',
    name: 'Hukuk & Kamu',
    jobTitles: [
      {
        id: 'avukat',
        name: 'Avukat / Hukuk Danışmanı',
        suggestedSkills: [
          { name: 'Dilekçe ve Sözleşme Yazımı', category: 'Mesleki Bilgi' },
          { name: 'İş Hukuku ve Mevzuat', category: 'Mesleki Bilgi' },
          { name: 'Ticaret ve Şirketler Hukuku', category: 'Mesleki Bilgi' },
          { name: 'UYAP Bilişim Sistemi', category: 'Makine/Ekipman' },
          { name: 'Arabuluculuk', category: 'Sertifika/Belge' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Hukuk fakültesinden mezun, yasal stajını tamamlamak üzere olan, adliye süreçlerini ve icra takiplerini hızla öğrenen stajyer avukat.' },
          { level: 'Kalfa', text: 'Duruşma tecrübesi olan, dava dosyalarını bağımsız yürütebilen, kurumsal sözleşmeleri inceleyip revize eden aktif bağlı veya serbest avukat.' },
          { level: 'Usta', text: 'Büyük ölçekli ticari davalarda, şirket birleşmeleri (M&A) ve işçi-işveren uyuşmazlıklarında uzmanlaşmış, risk analizi yapabilen kıdemli Hukuk Müşaviri.' }
        ]
      }
    ]
  },
  {
    id: 'tekstil-konfeksiyon',
    name: 'Tekstil & Konfeksiyon',
    jobTitles: [
      {
        id: 'dikis-makinecisi',
        name: 'Dikiş Makinecisi / Overlokçu',
        suggestedSkills: [
          { name: 'Düz Dikiş Makinesi (Sanayi Tipi)', category: 'Makine/Ekipman' },
          { name: 'Overlok ve Reşme Makinesi', category: 'Makine/Ekipman' },
          { name: 'Pastal Serimi ve Kesim', category: 'Mesleki Bilgi' },
          { name: 'İlik & Düğme Otomasyonu', category: 'Makine/Ekipman' },
          { name: 'Kumaş Türleri ve Esneklik Bilgisi', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Tekstil atölyesinde ortacılık ve iplik temizleme yaparak sektöre giren, sanayi tipi makine kullanımını temelden öğrenmeye hevesli çırak.' },
          { level: 'Kalfa', text: 'Düz dikiş ve overlok makinelerini seri üretim hızında ve sıfır fireyle kullanabilen, parça birleştirme işlemlerine tam hakim tekstil işçisi.' },
          { level: 'Usta', text: 'Komple kıyafet dikimi (örneğin ceket/pantolon montajı) yapabilen, modelistin çıkardığı kalıbı kusursuz uygulayan, makine ayarlarını kendi yapabilen Model Makineci / Usta.' }
        ]
      },
      {
        id: 'utu-kalite',
        name: 'Ütücü / Tekstil Kalite Kontrol',
        suggestedSkills: [
          { name: 'Sanayi Tipi Pres Ütü', category: 'Makine/Ekipman' },
          { name: 'Buhar Jeneratörlü Ütü', category: 'Makine/Ekipman' },
          { name: 'Dikiş Hatası Tespiti (Ölçü/Simetri)', category: 'Mesleki Bilgi' },
          { name: 'Leke Çıkarma İşlemleri', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Konfeksiyon son ütü paket (SÜP) bölümünde çalışarak, ürün katlama, etiketleme ve basit ara ütü işlemlerinde tecrübe kazanacak personel.' },
          { level: 'Kalfa', text: 'Sanayi tipi buharlı ve pres ütüleri kumaş hassasiyetine göre kullanabilen, çıkan ürünlerin paketleme öncesi duruşunu kusursuzlaştıran ütücü.' },
          { level: 'Usta', text: 'İhracat standartlarındaki tekstil ürünlerinin son kalite (Final QA) kontrollerini yapan, milimetrik ölçüm hatalarını ve kumaş defolarını (hata) anında ayıklayan tecrübeli son kontrol ustası.' }
        ]
      }
    ]
  },
  {
    id: 'egitim',
    name: 'Eğitim',
    jobTitles: [
      {
        id: 'ogretmen',
        name: 'Öğretmen / Eğitmen',
        suggestedSkills: [
          { name: 'Pedagojik Formasyon', category: 'Sertifika/Belge' },
          { name: 'Müfredat Planlama ve Materyal Geliştirme', category: 'Mesleki Bilgi' },
          { name: 'Sınıf Yönetimi', category: 'Mesleki Bilgi' },
          { name: 'Akıllı Tahta ve LMS', category: 'Makine/Ekipman' },
          { name: 'Özel Eğitim / Kaynaştırma Eğitimi', category: 'Mesleki Bilgi' }
        ],
        summaryTemplates: [
          { level: 'Çırak', text: 'Eğitim fakültesinden yeni mezun, modern öğrenim tekniklerini sınıfta uygulamaya hevesli, öğrencileriyle güçlü bir iletişim kurmayı hedefleyen aday öğretmen.' },
          { level: 'Kalfa', text: 'Branşına tam hakim, Milli Eğitim müfredatını başarıyla uygulayan, Veli-Okul ilişkilerini sağlıklı yöneten ve teknolojik araçları derse entegre eden tecrübeli öğretmen.' },
          { level: 'Usta', text: 'Yılların pedagojik tecrübesiyle kendi öğretim materyallerini üreten, zümre başkanlığı yapabilen, sınav odaklı (LGS/YKS) veya mesleki eğitimde yüksek başarı yakalayan uzman eğitmen.' }
        ]
      }
    ]
  }

];