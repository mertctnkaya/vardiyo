# VARDİYO - GELECEK VİZYONU & YOL HARİTASI (ROADMAP)

Bu doküman, Vardiyo projesinin gelecek sürümleri, ürün stratejisi, yapay zeka entegrasyonları ve mavi yaka çalışan vizyonunu kayıt altında tutan canlı bir "Yol Haritası"dır.

---

## 🚀 SON TAMAMLANANLAR (COMPLETED)

- **[Offline-First & Senkronizasyon (Sync Queue) Mimarisi]**
  - Fabrika, şantiye ve internetsiz ortamlarda mesai takvimi, ayarlar, katsayılar ve hatırlatıcılar için tam çevrimdışı çalışma desteği.
  - İnternet geldiğinde otomatik çalışan arka plan senkronizasyon motoru (`syncService`).
  - Navbar'da canlı çevrimdışı ve kuyrukta bekleyen kayıt sayacı (`OfflineSyncIndicator`).
- **[Mobil (Capacitor) Native Hardening]**
  - Android Donanım Geri Tuşu (`@capacitor/app` entegrasyonu ile çekmece, modal ve sayfa geri hiyerarşisi).
  - Güvenli Alanlar (Safe Area Insets) ve çentik / Dinamik Ada (`viewport-fit=cover`, CSS env değişkenleri).
  - Sanal klavye açıldığında input alanının ekran ortasına otomatik kaydırılması (`scrollIntoView`).
  - Haptic Feedback (`@capacitor/haptics`) ile titreşimli geri bildirimler.
- **[Yevmiye (Günlük) Sistemi & Takvim Geliştirmeleri]**
  - Yevmiyeciler için tam kazanç ve çalışma modeli.
  - Yıllık izin girişinde hafta sonu ve resmi tatilleri atlayarak kanuni izin hakkını koruma.
  - Mesai takviminde tek tıkla "Bu Ayın Tüm Kayıtlarını Temizle" butonu.
  - Mesai takviminde vardiya türünün (3 Vardiya, 2 Vardiya, Sabit, Yevmiye) her ekranda görünür kılınması.
- **[Gelişmiş PDF & Veri Görselleştirme]**
  - Bordro, Tazminat ve Mesai Takvimi için tek sayfaya sığan resmi antetli, tablolu PDF çıktısı.
  - Recharts ile son 6 aylık kazanç, mesai ve devamsızlık trend grafikleri.
  - PDF Motoru TypeScript değişken hataları giderildi (`pdfGenerator.ts`).
- **[Paywall (Premium) Stratejisi Değişimi]**
  - İşsizlik, Rapor Parası, Süt İzni, Kısa Çalışma ve Zam Simülatörü gibi temel yasal hesaplama modülleri tamamen ücretsiz (Free) hale getirildi.
  - Premium kısıtlaması, "Bu Ayın Tüm Kayıtlarını Temizle" gibi toplu işlem (bulk action) butonlarına kaydırıldı.
- **[Teknik S.S.S & Kullanıcı Eğitimi (FAQ)]**
  - Kullanıcıları uygulamanın geri plandaki hesaplama zekası (14 saat kuralı, hafta sonu atlaması, kümülatif vergi) hakkında bilgilendiren 16 maddelik teknik SSS oluşturuldu.
  - SSS kategorileri tamamen açılır/kapanır (collapsible) yapıldı ve sistemin tasarım renk kodlarına (Indigo, Amber, Emerald, Red, Purple) göre temalandırıldı.

---

## 🎯 1. AŞAMA: HIZLI DEĞER ÜRETEN ÖZELLİKLER & ONBOARDING

Kullanıcının ilk kurulumunu saniyelere indiren ve viral yayılmayı tetikleyen özellikler:

- [ ] **İşyeri & Sektör Hazır Şablonları (Presets):**
  - Ayarlar sayfasında tek tıkla uygulanabilen popüler işkolu şablonları.
  - _MESS Metal & Otomotiv:_ Fazla mesai %100, gece zammı %15, 3 vardiya döngüsü.
  - _Özel Güvenlik:_ 12/36, 12/24 veya 2+2+2 nöbet döngüleri.
  - _Sağlık Personeli:_ 24 saat nöbet - 48 saat blok izin şablonu.
  - _Lojistik & Depo:_ Sabit gündüz + 45 saatlik kota ve %50 zamlı mesai.
  - _Standart 4857:_ Kanuni asgari oranlar.
- [ ] **Mavi Yaka Akıllı CV Oluşturucu (Smart Worker CV Builder):**
  - Mavi yakaya özel soru-cevap sihirbazı (kullandığı makineler, SRC, Forklift, Kaynakçı sertifikaları, vardiya tecrübesi).
  - Sıfır İŞKUR riskiyle doğrudan kullanıcının cihazında antetli, koyu/profesyonel 1 sayfalık PDF CV üretimi.
  - İşçinin WhatsApp'tan fabrikaya gönderebileceği veya elden teslim edebileceği temiz çıktı.
- [x] **WhatsApp Vardiya Paylaşım Kartı (Viral Büyüme Motoru):**
  - Takvimden tek tıkla "Haftalık Vardiya Çizelgem" görseli üretme (html-to-image altyapısıyla hatasız render).
  - İşçinin arkadaşlarına, ailesine veya WhatsApp grubuna atabileceği şık, altında _"Vardiyo ile planlandı"_ imzalı HD paylaşım kartı.
  - Akıllı "Sonraki Vardiya" dedektörü ile önümüzdeki 7 gün içerisindeki ilk çalışma gününün tarihini ve vardiyasını otomatik hesaplama.

---

## 🤖 2. AŞAMA: YAPAY ZEKA & AKILLI HUKUK RADARI

İşçiyi koruyan, hak kaybını önleyen ve rakiplerde olmayan teknolojik sıçrama:

- [ ] **Vardiyo Hukuk & Vardiya Asistanı (AI Chatbot):**
  - Google Gemini 2.0 Flash + Supabase Edge Functions mimarisi (Ücretsiz katman).
  - Katı Guardrails ve rol kalkanı (sistem yönergelerini ve kullanıcı verilerini asla sızdırmaz, konu dışına çıkmaz).
  - Kullanıcının çalışma geçmişini, bordrosunu ve brüt maaş bilgilerini güvenli bağlam (Context Injection) olarak alıp 4857 sayılı İş Kanunu'na göre anında hak hesabı yapma.
  - Örn: _"Patron bayramda mesai vermedi, bu ayki kayıtlarıma göre içeride kaç TL hakkım var?"_
- [ ] **Akıllı Hak Dedektörü & İhlal Radarı (Legal Risk Radar):**
  - _Gece Sınırı Uyarısı:_ Kanunen gece vardiyası 7.5 saati aşamaz (İş Kanunu Md. 69). Sistem bunu aştığında otomatik uyarı verir: _"Dikkat: Gece çalışmanız 7.5 saati aşıyor, zamlı ücret hakkınız doğdu!"_
  - _Dinlenme Süresi:_ İki vardiya arasında 11 saatlik dinlenme kuralı ihlal edildiğinde bildirim düşer.
- [ ] **Bordro Çapraz Karşılaştırma & Fark Dedektörü:**
  - İşverenin verdiği resmi bordro tutarını girip Vardiyo'nun hesapladığı gerçek tutarla karşılaştırma.
  - _"Şirket bordronuzda 12 saat mesai yatmış, fakat Vardiyo takviminizde 16 saat kayıt var! 4 saatlik (X TL) eksik ödeme tespit edildi."_

---

## ⏰ 3. AŞAMA: BİLDİRİM, ALARM VE GÜNLÜK KOLAYLIKLAR

- [ ] **Bayram & Resmi Tatil Çift Yevmiye Alarmları:**
  - Yaklaşan milli ve dini bayramlarda (29 Ekim, 1 Mayıs vb.) otomatik uyarı:
  - _"Bayramda çalışıyorsanız kanunen 2 katı yevmiye almalısınız! Çalıştığınız günleri takvime işlemeyi unutmayın."_
- [ ] **Vardiya Takas Yöneticisi (Shift Swap Manager):**
  - Mesai arkadaşıyla vardiya takas eden işçiler için (Örn: "Ahmet ile Salı-Perşembe değişildi") takvim notu ve otomatik saat güncellemesi.
- [ ] **Gelişmiş Push Notification & Servis Alarmları:**
  - Gece vardiyasına veya fabrika servisine binme saatine özel dinamik native alarmlar.

---

## 🏢 4. AŞAMA: İLERİ DÖNEM VİZYONU & GELİR (ENTERPRISE)

- [ ] **Vardiyo Kariyer & Mavi Yaka İlan Portalı (10.000+ Aktif İşçide):**
  - İŞKUR "Özel İstihdam Bürosu (ÖİB)" izin belgesi ve teminatı alınarak şirketlerin ilan girdiği, mavi yaka işçi aradığı iki taraflı pazar yerine geçiş.
  - Şirketlere ücretli ilan ve öne çıkarma satışı.
- [ ] **Sendika & İşyeri Temsilcisi Raporlama Portalı:**
  - İşyeri sendika temsilcilerinin veya vardiya amirlerinin kendi ekiplerinin toplam mesai yükünü anonim olarak izleyebileceği kurumsal gösterge paneli.

---

_Not: Proje tasarım anayasası gereği "Çoklu Açık/Renkli Temalar" rafa kaldırılmıştır; uygulama endüstriyel, göz yormayan yüksek kontrastlı koyu mod (#0f1115 / #16191d) felsefesini koruyacaktır._
