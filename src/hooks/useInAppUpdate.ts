import { useEffect } from 'react';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { isNative } from '../utils/isNative';
import { useToastStore } from '../store/useToastStore';

export const useInAppUpdate = () => {
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    // Sadece Mobil (Native) ortamda çalışır
    if (!isNative()) return;

    const checkAndApplyUpdate = async () => {
      try {
        const info = await AppUpdate.getAppUpdateInfo();

        // 2: UPDATE_AVAILABLE
        if (info.updateAvailability === 2) {

          if (info.flexibleUpdateAllowed) {
            await AppUpdate.startFlexibleUpdate();

            AppUpdate.addListener('onFlexibleUpdateStateChange', async (state) => {
              // 11: DOWNLOADED
              if (state.installStatus === 11) {
                addToast('Yeni sürüm indirildi. Yeniden başlatılıyor...', 'success');

                setTimeout(async () => {
                  await AppUpdate.completeFlexibleUpdate();
                }, 1500);
              }
            });
          } else if (info.immediateUpdateAllowed) {
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

