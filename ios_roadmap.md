# VARDİYO — iOS & APP STORE YOL HARİTASI (IOS_ROADMAP)

Bu belge, **Vardiyo v1.6.0** (Google Play Store'da kapalı testte olan güncel sürüm) kod tabanının birebir aynı özellik setiyle Apple App Store ve TestFlight'a çıkarılması için gereken tüm teknik adımları, mağaza gereksinimlerini, Apple inceleme kriterlerini ve icraat planını içerir.

---

## 1. MEVCUT DURUM VE HEDEF

- **Mevcut Sürüm:** Vardiyo v1.6.0 (Android tarafında AAB derlendi ve 12 test kullanıcısı ile kapalı test süreci aktif).
- **Altyapı:** React 19 + Vite + Tailwind CSS + DaisyUI (Dark Mode) + Zustand + Supabase.
- **iOS Durumu:** `@capacitor/ios` (v8.5.0) paketi projede kurulu, `ios/` klasörü ve `App.xcodeproj` oluşturulmuş durumda.
- **RevenueCat:** `src/services/revenuecat.ts` servisi `platform === 'ios'` mantığı ve `VITE_REVENUECAT_APPLE_API_KEY` kontrolü ile hazırlandı.
- **Hedef:** Hiçbir özellik kaybı olmadan ve Apple App Store onay süreçlerine (App Review Guidelines) takılmadan iOS uygulamasını TestFlight ve App Store'a taşımak.

---

## 2. ÖN GEREKSİNİMLER (DONANIM VE HESAPLAR)

1. **macOS Ortamı:**
   - Apple, iOS derlemeleri için fiziksel bir Mac (MacBook, Mac mini, Mac Studio vb.) veya bulut tabanlı bir macOS ortamı (Codemagic, MacStadium, GitHub Actions macOS runner) zorunlu tutar.
   - **Xcode 15 veya 16** ve Apple Command Line Tools kurulu olmalıdır.
   - **CocoaPods** (`sudo gem install cocoapods`) veya Xcode Swift Package Manager.
2. **Apple Developer Program Üyeliği:**
   - [developer.apple.com](https://developer.apple.com) üzerinden aktif yıllık Apple Developer hesabı (Yıllık 99$).
   - App Store Connect erişimi ve "Agreements, Tax, and Banking" sözleşmelerinin imzalanmış olması (IAP/Abonelik satışı için şarttır).

---

## 3. ADIM ADIM İCRAAT PLANI

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VARDİYO iOS ÇIKIŞ PLANI                         │
└────────────────────────────────────────────────────────────────────────┘
  [Aşama 1] Web Build & Capacitor iOS Senkronizasyonu (Sync)
       │
  [Aşama 2] Info.plist, İzinler & Güvenlik Tanımlamaları
       │
  [Aşama 3] App Store Connect & RevenueCat iOS Ürün Eşitlemesi
       │
  [Aşama 4] İkonlar, Splash Screen & Asset Üretimi
       │
  [Aşama 5] Xcode İmzalama (Signing), Simülatör Testi & Arşivleme
       │
  [Aşama 6] TestFlight Dağıtımı (İç ve Dış Testler)
       │
  [Aşama 7] App Store İnceleme Süreci ve Yayına Alım (Go-Live)
```

---

### AŞAMA 1: PROJE HAZIRLIĞI VE SENKRONİZASYON

Windows ortamında hazırlanan kodların Mac ortamında derlenmeye hazır hale getirilmesi adımıdır.

1. **Web Build Alınması:**

   ```bash
   npm run build
   ```

   _`dist/` klasörü en güncel v1.6.0 kodlarıyla üretilir._

2. **Capacitor iOS Senkronizasyonu:**

   ```bash
   npx cap sync ios
   ```

   _Bu komut web varlıklarını, yüklü eklentileri (`@capacitor/local-notifications`, `@capacitor/share`, `@capacitor/filesystem`, `@revenuecat/purchases-capacitor`) iOS projesine aktarır._

3. **Versiyon Numaralarının Eşitlenmesi:**
   - `ios/App/App/Info.plist` veya Xcode Target ayarlarından:
     - `CFBundleShortVersionString` (Sürüm): `1.6.0`
     - `CFBundleVersion` (Build): `1` (Her yeni arşiv yüklemesinde 1 artırılır: 1, 2, 3...)

---

### AŞAMA 2: İZİNLER VE INFO.PLIST YAPILANDIRMASI

Apple, kullanıcı gizliliği konusunda çok katıdır. Kullanılan eklentilerin ihtiyaç duyduğu tüm izin açıklamaları `ios/App/App/Info.plist` dosyasına eklenmelidir.

1. **Dosya İndirme & Paylaşım İzinleri (`@capacitor/share`, `@capacitor/filesystem`, CV PDF):**

   - Vardiyo'da kullanıcılar hazırladıkları CV'leri (ATS & Atölye) PDF olarak indirebilmekte ve haftalık vardiyalarını WhatsApp ile paylaşabilmektedir.

   ```xml
   <!-- Dosyalar uygulamasında gösterim ve yerel depolama -->
   <key>UIFileSharingEnabled</key>
   <true/>
   <key>LSSupportsOpeningDocumentsInPlace</key>
   <true/>

   <!-- Görsel veya PDF kaydetme durumunda galeri/dosya açıklaması -->
   <key>NSPhotoLibraryAddUsageDescription</key>
   <string>Vardiya kartınızı ve oluşturduğunuz CV'leri cihazınıza kaydedebilmeniz için izin gereklidir.</string>
   ```

2. **Bildirim İzinleri (`@capacitor/local-notifications`):**

   - Vardiyo vardiya hatırlatıcıları, resmi tatil ve risk radar uyarıları göndermektedir.
   - Kullanıcı uygulama içinden bildirimleri açtığında sistem izin diyaloğu tetiklenir (kodumuzda `LocalNotifications.requestPermissions()` zaten mevcut).

3. **Ağ Güvenliği (ATS - App Transport Security):**
   - Supabase ve RevenueCat tamamen güvenli HTTPS/WSS kullandığı için varsayılan iOS güvenlik kısıtlamalarıyla %100 uyumludur.

---

### AŞAMA 3: REVENUECAT & APPLE IN-APP PURCHASE (IAP) EŞİTLEMESİ

Vardiyo'nun Google Play'de kurulan 3'lü gelir modeli Apple ekosistemine bağlanmalıdır:

1. **App Store Connect Ürün Tanımlamaları:**
   _App Store Connect > My Apps > Vardiyo > Subscriptions & In-App Purchases_

   - **Grup Adı:** `Vardiyo Pro / Premium`
   - **Ürün 1 (Aylık Abonelik):**
     - Product ID: `vardiyo_premium_monthly`
     - Reference Name: Vardiyo Premium Aylık
     - Fiyat Kademesi: 99.99 TL
   - **Ürün 2 (Yıllık Abonelik):**
     - Product ID: `vardiyo_premium_annual`
     - Reference Name: Vardiyo Premium Yıllık
     - Fiyat Kademesi: 649.99 TL
   - **Ürün 3 (Ömür Boyu - Non-Consumable IAP):**
     - Product ID: `vardiyo_premium_lifetime`
     - Reference Name: Vardiyo Premium Ömür Boyu
     - Tip: Non-Consumable (Tüketilmeyen Ürün)

2. **RevenueCat Dashboard Entegrasyonu:**

   - App Store Connect > Users and Access > Integrations > In-App Purchase Key (veya Shared Secret) oluşturulur.
   - RevenueCat Dashboard > Project Settings > Apple App Store sekmesine bu anahtar girilir ve `Bundle ID` (`com.mertcancetinkaya.vardiyo`) bağlanır.
   - RevenueCat tarafından verilen **Public Apple API Key** alınır.
   - Projedeki ortam değişkenine eklenir:
     ```env
     VITE_REVENUECAT_APPLE_API_KEY=appl_xxxxxxxxxxxxxxxxxxxxxxxx
     ```

3. **Apple Paywall Zorunlulukları (Zaten Hazır):**
   - Apple Guideline 3.1.2 uyarınca paywall ekranında bulunması zorunlu olan:
     - [x] **Satın Alımları Geri Yükle (Restore Purchases)** butonu (`restorePurchases()` hazır)
     - [x] **Kullanım Koşulları (Terms of Use / EULA)** linki (Hazır)
     - [x] **Gizlilik Politikası (Privacy Policy)** linki (Hazır)
     - [x] Abonelik süresi, iptal koşulları ve yenilenme detayları (Hazır)

---

### AŞAMA 4: GÖRSEL VARLIKLAR VE İKONLAR (ASSETS)

Apple, uygulama ikonlarında ve açılış ekranlarında katı kurallar uygular:

1. **İkon Üretimi:**

   - Projede `@capacitor/assets` aracı mevcuttur.
   - Kaynak logo (`assets/icon.png` - 1024x1024 px) kullanılarak iOS için otomatik ikon seti oluşturulur:
     ```bash
     npx @capacitor/assets generate --ios
     ```
   - **KRİTİK KURAL:** Apple App Store ikonu (1024x1024) **şeffaf (alpha kanalı) İÇERMEMELİDİR**. Arka plan tamamen dolu (`#16191d` veya `#0f1115`) olmalıdır. Şeffaflık olursa App Store yükleme sırasında hata verir.

2. **LaunchScreen (Açılış Ekranı):**
   - `ios/App/App/Base.lproj/LaunchScreen.storyboard` dosyası karanlık mod temamıza uygun şekilde merkezde Vardiyo logosu olacak şekilde ayarlanır.

---

### AŞAMA 5: XCODE DERLEME, İMZALAMA VE ARŞİVLEME

1. **Xcode Projesini Açma:**

   ```bash
   npx cap open ios
   ```

2. **Signing & Capabilities:**

   - `App` target'ı seçilir.
   - **Signing & Capabilities** sekmesinde:
     - `Automatically manage signing` işaretlenir.
     - `Team`: Apple Developer hesabı seçilir.
     - `Bundle Identifier`: `com.mertcancetinkaya.vardiyo`
   - Gerekli yetenekler (Capabilities):
     - `In-App Purchase` (Otomatik veya manuel eklenir).
     - `Push Notifications` ve `Background Modes` (Bildirimler için).

3. **Derleme & Arşiv (Archive):**
   - Hedef cihaz olarak **"Any iOS Device (arm64)"** seçilir.
   - Menüden: `Product > Archive`
   - Arşiv tamamlandığında **Organizer** penceresi açılır.
   - `Distribute App` > `App Store Connect` > `Upload` seçilerek derleme Apple sunucularına gönderilir.

---

### AŞAMA 6: TESTFLIGHT SÜRECİ

Google Play'de 12 test kullanıcısıyla yürütülen sürecin iOS tarafındaki karşılığı **TestFlight**'tır.

1. **Dahili Test (Internal Testing):**
   - Apple Developer hesabına kayıtlı ekip üyeleri (1-100 kişi).
   - Derleme yüklendikten 10-15 dakika sonra işlenir (processing) ve **anında** kullanılabilir hale gelir.
2. **Harici Test (External Testing):**
   - Dışarıdan 10.000 kişiye kadar herkese açık veya e-posta davetli test grubu oluşturulabilir.
   - İlk harici derleme için Apple 24 saat içinde hızlı bir "Beta App Review" yapar. Onaylandıktan sonra genel link paylaşılabilir.

---

### AŞAMA 7: APP STORE CONNECT MAĞAZA GİRİŞİ VE İNCELEME

1. **Gerekli Mağaza Görselleri (Ekran Görüntüleri):**

   - **6.9 / 6.7 inç iPhone** (iPhone 16 Pro Max, 15 Pro Max vb. - 1290 x 2796 px veya 1320 x 2868 px) - _Zorunlu_
   - **6.5 inç iPhone** (iPhone 11 Pro Max / XS Max - 1242 x 2688 px) - _Zorunlu_
   - **5.5 inç iPhone** (iPhone 8 Plus - 1242 x 2208 px) - _İsteğe bağlı veya eski ekranlar için_
   - Ekranlar: Takvim/Vardiya ekranı, Bordro & Mesai Hesaplama, Akıllı CV Oluşturucu, Risk Radarı.

2. **Mağaza Metinleri:**

   - **Uygulama Adı:** Vardiyo - Vardiya & Bordro
   - **Alt Başlık:** Vardiya Takvimi, Mesai & CV
   - **Kategoriler:** Üretkenlik (Productivity) / İş (Business)
   - **Gizlilik Politikası URL:** `https://vardiyo.vercel.app/privacy`
   - **Kullanım Koşulları (EULA):** `https://vardiyo.vercel.app/terms` (veya Apple Standart EULA)
   - **Destek URL:** `https://vardiyo.vercel.app/contact`

3. **Uygulama Gizlilik Beyanı (App Privacy Nutrition Label):**

   - İletişim Bilgileri: E-posta (Hesap oluşturma için)
   - Kullanıcı İçeriği: Vardiya ve CV verileri (Uygulama işlevselliği için)
   - Satın Alma Geçmişi: RevenueCat abonelik doğrulaması için
   - Tanımlayıcılar: User ID
     _(Tüm veriler sadece uygulama işlevselliği içindir, 3. taraflarla reklam amacıyla paylaşılmaz)._

4. **İnceleme Notları ve Test Hesabı (App Review Information):**
   - Apple inceleme ekibinin uygulamayı tam test edebilmesi için çalışan bir test hesabı sağlanmalıdır:
     - E-posta: `demo@vardiyo.com` (veya benzeri hazır test hesabı)
     - Şifre: `********`
   - Açıklama notu: Uygulamanın vardiya çalışanlarına özel nöbet, mesai hesaplama ve CV hazırlama aracı olduğu, IAP paketlerinin Sandbox ortamında test edilebileceği belirtilir.

---

## 4. APPLE İNCELEMESİNDE SIK KARŞILAŞILAN RED SEBEPLERİ VE VARDİYO KONTROL LİSTESİ

| Kural                              | Apple Maddesi      | Vardiyo Durumu                                                                                                                           |
| :--------------------------------- | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Hesap Silme (Account Deletion)** | Guideline 5.1.1(v) | **HAZIR.** `profile.tsx` içinde `AccountSection` kullanıcının hesabını ve tüm verilerini doğrudan uygulama içinden silebilmesini sağlar. |
| **Geri Yükleme Butonu (Restore)**  | Guideline 3.1.2    | **HAZIR.** `PremiumPaywallModal.tsx` içinde "Satın Alımları Geri Yükle" butonu mevcuttur.                                                |
| **Kullanım Koşulları & Gizlilik**  | Guideline 3.1.2    | **HAZIR.** Paywall modalında ve ayarlarda EULA ve KVKK/Gizlilik linkleri yer alır.                                                       |
| **Şeffaf İkon Hatası**             | Asset Requirements | 1024x1024 App Store ikonunun arka planı tamamen opaktır (şeffaf kanal yoktur).                                                           |
| **Harici Ödeme Yönlendirmesi**     | Guideline 3.1.1    | Uygulama içinde Stripe, IBAN, harici link vb. ödeme yoktur; tamamen RevenueCat / Apple IAP kullanılır.                                   |
| **Android / Google İbareleri**     | Guideline 2.3.1    | Uygulama içi metinlerde "Google Play" veya "Android" terimleri bulunmaz, nötr ve profesyonel dil kullanılır.                             |

---

## 5. ÖZET EYLEM PLANI (SIRADAKİ ADIMLAR)

1. [ ] Mac ortamında projeyi açmak ve `npm run build && npx cap sync ios` çalıştırmak.
2. [ ] `ios/App/App/Info.plist` dosyasına yukarıda belirtilen izin ve sürüm etiketlerini girmek.
3. [ ] Apple Developer Portal'da App ID (`com.mertcancetinkaya.vardiyo`) ve App Store Connect kaydını açmak.
4. [ ] In-App Purchase ürünlerini (`vardiyo_premium_monthly`, `vardiyo_premium_annual`, `vardiyo_premium_lifetime`) App Store Connect ve RevenueCat üzerinde eşitlemek.
5. [ ] İkon ve Splash varlıklarını `npx @capacitor/assets generate --ios` ile derlemek.
6. [ ] Xcode'dan Archive alıp TestFlight'a yüklemek ve ekiple kapalı testleri başlatmak.
7. [ ] Mağaza ekran görüntüleri ve açıklamalarıyla App Store onayına göndermek.
