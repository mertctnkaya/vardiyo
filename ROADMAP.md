# VARDİYO - GELECEK VİZYONU & YOL HARİTASI (ROADMAP)

Bu doküman, Vardiyo projesinin gelecekteki geliştirmeleri, mobil iyileştirmeleri ve vizyon fikirlerini kayıt altında tutmak için "Zihin Haritası" (Mind Map) olarak oluşturulmuştur.

## 🚀 SON EKLENEN ÖZELLİKLER (COMPLETED)

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

## 1. MOBİL (CAPACITOR) İYİLEŞTİRMELERİ (NATIVE FEEL)

- [x] **Haptic Feedback (Titreşimli Geri Bildirim):**
  - `@capacitor/haptics` eklentisi ile kullanıcı etkileşimlerini fiziksel hissettirme.
- [x] **Offline-First (İnternetsiz Kullanım & Sync Queue) Mimarisi:**
  - Fabrika ve depo gibi internetin çekmediği alanlarda çalışanlar için mesai, takvim, ayar ve hatırlatıcı girişlerini yerelde kuyruğa alıp bağlantı sağlandığında arka planda otomatik eşitleme (Optimistic UI & Canlı Navbar Rozeti).
- [x] **In-App Review (Uygulama İçi Değerlendirme):**
  - Kullanıcı kritik bir işlem yaptığında (Aha! Moment) mağaza değerlendirme uyarısı.
- [x] **Android Donanım Geri Tuşu & Safe Area:**
  - Çekmece/modal kapatma hiyerarşisi ve çentik koruması.
- [ ] **Gelişmiş Push Notification & Alarmlar:**
  - Gece vardiyasına veya servise binme saatine özel, lokasyon/saat bazlı dinamik native alarmların eklenmesi.

## 2. ÜRÜN & UI GELİŞTİRMELERİ (ENTERPRISE SAAS VİZYONU)

- [x] **Veri Görselleştirme (Grafikler & Analitik Tablosu):**
  - Recharts kütüphanesi ile son 6 aylık kazanç, fazla mesai ve devamsızlık trendleri.
- [ ] **Oyunlaştırma (Gamification) ve Streak Sistemi:**
  - Kullanıcıyı uygulamaya her gün girmeye teşvik edecek "Seri" mekaniği.
- [x] **Gelişmiş PDF İhracatı (Resmi Evrak Formatı):**
  - Bordro, Tazminat ve Mesai Takvimi için tek sayfaya sığan, logolu, resmi tablolu ve kaşe/imza alanlı `jspdf-autotable` çıktısı.
- [ ] **Çoklu Tema Seçenekleri (Dark Mode Varyasyonları):**
  - Şu anki profesyonel indigo/emerald konseptine ek olarak, kişiselleştirilebilir premium renk paketleri (Neon Blue, Corporate Slate, Gold).

## 3. PREMIUM & GELİR MODELLERİ (AI & YASAL DESTEK)

- [ ] **Yapay Zeka Destekli "Vardiyo Asistan" (Chatbot):**
  - Supabase Edge Functions + Gemini/OpenAI API entegrasyonu.
  - Kullanıcının çalışma geçmişini, bordrosunu ve brüt maaş bilgilerini bağlam (context) olarak alıp İş Kanunu sorularına kişiselleştirilmiş hukuki cevaplar veren bir danışman.
  - Örn: _"Patron pazar günü mesai vermedi, bu ayki kayıtlarıma göre içeride ne kadar hakkım var?"_
- [ ] **Genişletilmiş İhracat Seçenekleri:**
  - Premium kullanıcılara sınırsız PDF/Excel export hakkı tanınması ve tüm takvim/vardiya verisinin bulutta yedeklenmesi ayrıcalığı.

---

_Not: Bu fikirler, projenin mevcut kararlı ve temiz mimarisi üzerine inşa edilecek, "Nice-to-Have" (Olsa Çok İyi Olur) listesidir. Geliştirme sürecinde öncelik sırasına göre backlog'a alınacaktır._
