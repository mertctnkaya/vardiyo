import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { isNative } from './isNative';

export const triggerHaptic = async (style: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  if (!isNative()) return; // Sadece native (mobil) tarafta çalışsın
  
  try {
    switch (style) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'warning':
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case 'error':
        await Haptics.notification({ type: NotificationType.Error });
        break;
      default:
        await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch (error) {
    console.warn('Haptics failed:', error);
  }
};
