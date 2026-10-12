# Vardiyo: Google Play In-App Update Entegrasyon Rehberi

Google Play Console'da uygulamanız onaylandıktan sonra, gelecekteki güncellemelerde kullanıcıların uygulamadan çıkmadan, arka planda güncellemeyi indirip kurmasını sağlayacak sistemin tam kodudur.

## 1. Eklentinin Kurulması

Terminali açıp şu komutları çalıştırarak resmi Capawesome kütüphanesini projeye dahil edin:

```bash
npm install @capawesome/capacitor-app-update
npx cap sync
```

## 2. Özel Hook'un Oluşturulması

`src/hooks/` klasörü içerisine **`useInAppUpdate.ts`** adında yeni bir dosya oluşturun ve aşağıdaki kodu yapıştırın. Bu kod, sadece native cihazlarda çalışacak ve arka planda sessizce Play Store'dan güncellemeyi çekecektir.

```typescript
import { useEffect } from 'react';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { isNative } from '../utils/isNative';
import { useToastStore } from '../store/useToastStore';

export const useInAppUpdate = () => {
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    // 1. Sadece Mobil (Native) ortamda çalışır, Web'de (PWA) devreye girmez.
    if (!isNative()) return;

    const checkAndApplyUpdate = async () => {
      try {
        // Google Play'den mevcut güncelleme bilgisini al
        const info = await AppUpdate.getAppUpdateInfo();

        // updateAvailability === 2 demek "Yeni Güncelleme Var" demektir.
        if (info.updateAvailability === 2) {
          
          // ÖNCELİK: Esnek Güncelleme (Arka Planda İndirme)
          // Kullanıcı uygulamayı kullanmaya devam ederken arka planda indirilir.
          if (info.flexibleUpdateAllowed) {
            await AppUpdate.startFlexibleUpdate();
            
            // İndirme ilerlemesini dinle
            AppUpdate.addListener('onFlexibleUpdateStateChange', async (state) => {
              // installStatus === 11 demek "İndirme Tamamlandı, Kuruluma Hazır" demektir.
              if (state.installStatus === 11) {
                addToast('Yeni sürüm indirildi. Yeniden başlatılıyor...', 'success');
                
                // 1 saniye bekleyip uygulamayı yeniden başlatarak güncellemeyi kurar
                setTimeout(async () => {
                  await AppUpdate.completeFlexibleUpdate();
                }, 1500);
              }
            });
          } 
          // ALTERNATİF: Zorunlu Güncelleme
          // Eğer esnek güncelleme kapalıysa veya kritik bir güncellemeyse tam ekran uyarısı çıkar.
          else if (info.immediateUpdateAllowed) {
            await AppUpdate.performImmediateUpdate();
          }
        }
      } catch (error) {
        console.error('Google Play In-App Update Hatası:', error);
      }
    };

    checkAndApplyUpdate();
  }, [addToast]);
};
```

## 3. Sistemin Uygulamaya Bağlanması

Yazdığımız bu sistemi ana tasarım iskeletine entegre etmek için **`src/components/layout/MainLayout.tsx`** dosyasını açın. 

1. Dosyanın en üstündeki import alanına hook'u ekleyin:
```typescript
import { useInAppUpdate } from '../../hooks/useInAppUpdate';
```

2. `MainLayout` fonksiyonunun hemen içerisine (diğer hook'ların altına) ekleyin:
```typescript
export default function MainLayout() {
  useMobileBackHandler();
  useInAppUpdate(); // <-- BURAYI EKLİYORUZ
  
  // ... diğer kodlar
```

## Çalışma Mantığı & Beklentiler
- Kod çalıştığında kullanıcıya hiçbir "Güncelle" sorusu sormaz. 
- Google Play arka planda indirmeyi başlatır. 
- İndirme bittiğinde Vardiyo'nun yeşil/güzel toast bildirimi çıkar: *"Yeni sürüm indirildi. Yeniden başlatılıyor..."*
- Uygulama 1.5 saniye sonra kendi kendine kapanıp yeni sürümle saniyeler içinde geri açılır.
