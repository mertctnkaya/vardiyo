# VARDİYO - GELECEK VİZYONU & YOL HARİTASI (ROADMAP)

Bu doküman, Vardiyo projesinin gelecekteki geliştirmeleri, mobil iyileştirmeleri ve vizyon fikirlerini kayıt altında tutmak için "Zihin Haritası" (Mind Map) olarak oluşturulmuştur.

## 🚀 SON EKLENEN ÖZELLİKLER (COMPLETED)

- **[Yevmiye (Günlük) Sistemi Entegrasyonu]**
  - Standart aylık bordrolu sisteme ek olarak "Yevmiyeci" çalışanlar için tam destek eklendi.
  - Pazar günleri otomatik tatil, Cumartesi günleri normal gün olarak ayarlandı.
  - Ödeme periyotlarına (Haftalık, 15 Günlük, Günlük) göre otomatik kazanç kartları, tam ay çalışma projeksiyonu eklendi.
  - Yevmiye sistemi seçildiğinde kullanılamayacak yasal haklar/hesaplamalar (Kıdem, İşsizlik, vs.) UI üzerinden otomatik devre dışı bırakıldı.
- **[UX İyileştirmeleri]**
  - Mesai girme menüsündeki kafa karıştırıcı "Normal Mesai" butonu devre dışı bırakılıp sadece not/hatalı kayıt temizleme amacına yönlendirildi.
  - Yevmiyeciler için "Özel Yevmiye / Mesai" butonu ile günlük farklı yevmiye girişi hızlıca sağlandı.

## 1. MOBİL (CAPACITOR) İYİLEŞTİRMELERİ (NATIVE FEEL)

- [ ] **Haptic Feedback (Titreşimli Geri Bildirim):**
  - `@capacitor/haptics` eklentisi ile kullanıcı etkileşimlerini (mesai kaydetme, vardiya silme, hata alma) fiziksel olarak hissettirmek.
- [ ] **Offline-First (İnternetsiz Kullanım) Mimarisi:**
  - Fabrika ve depo gibi internetin çekmediği alanlarda çalışanlar için mesai girişlerini cihazda (IndexedDB / Zustand Persist) kuyruğa alıp (Queue), internet bağlantısı sağlandığında arka planda Supabase'e eşitleme (Optimistic UI).
- [ ] **In-App Review (Uygulama İçi Değerlendirme):**
  - `@capacitor-community/app-review` entegrasyonu. Kullanıcı yüksek bir tazminat hesapladığında veya ilk PDF çıktısını aldığında (Aha! Moment) otomatik olarak Play Store / App Store için 5 yıldız isteme.
- [ ] **Gelişmiş Push Notification & Alarmlar:**
  - Gece vardiyasına veya servise binme saatine özel, lokasyon/saat bazlı dinamik native alarmların eklenmesi.

## 2. ÜRÜN & UI GELİŞTİRMELERİ (ENTERPRISE SAAS VİZYONU)

- [ ] **Veri Görselleştirme (Grafikler & Analitik Tablosu):**
  - Recharts veya Chart.js kullanarak "İstatistikler" sekmesi oluşturma.
  - Son 6 aylık çalışma saati trendleri, fazla mesai yoğunluğu haritası, tahmini ve gerçekleşen kazanç karşılaştırmaları.
- [ ] **Oyunlaştırma (Gamification) ve Streak Sistemi:**
  - Kullanıcıyı uygulamaya her gün girmeye teşvik edecek "Seri" mekaniği.
  - Örn: _"Tebrikler! 15 gündür takvimini eksiksiz dolduruyorsun."_
- [ ] **Gelişmiş PDF İhracatı (Resmi Evrak Formatı):**
  - Çıktıların avukata veya İK departmanına doğrudan verilebilecek profesyonellikte antetli, tablolu ve imza sirkülerine uygun `jspdf-autotable` formatlarına yükseltilmesi.
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
