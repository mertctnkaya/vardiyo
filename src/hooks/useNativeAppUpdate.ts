import { useEffect } from 'react';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { isNative } from '../utils/isNative';

export const useNativeAppUpdate = () => {
  useEffect(() => {
    const checkForUpdate = async () => {
      // Sadece native mobil cihazlarda (Android/iOS) çalışacak
      if (!isNative()) return;

      try {
        const result = await AppUpdate.getAppUpdateInfo();

        // Eğer yeni bir güncelleme varsa (2 = UPDATE_AVAILABLE)
        if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
          // Anında (Immediate) tam ekran güncelleme penceresini gösterir.
          // Kullanıcı güncellemeyi yapmadan uygulamayı kullanamaz (Kritik güncellemeler için ideal)
          // Eğer arka planda indirip sonra kurmasını istiyorsanız startFlexibleUpdate() kullanılabilir.
          await AppUpdate.performImmediateUpdate();
        }
      } catch (error) {
        console.error('Native App Update check failed:', error);
      }
    };

    checkForUpdate();
  }, []);
};

