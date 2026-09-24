import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import type { CustomerInfo, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { isNative } from '../utils/isNative';

export const REVENUECAT_ENTITLEMENT = 'pro';

export const initRevenueCat = async (userId: string | undefined) => {
  if (!isNative()) {
    console.log('[RevenueCat] Web ortamında atlanıyor.');
    return;
  }

  try {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

    const platform = (window as any).Capacitor?.getPlatform();
    let apiKey = '';

    if (platform === 'android') {
      apiKey = import.meta.env.VITE_REVENUECAT_GOOGLE_API_KEY || '';
    } else if (platform === 'ios') {
      apiKey = import.meta.env.VITE_REVENUECAT_APPLE_API_KEY || '';
    }

    if (!apiKey) {
      console.warn('[RevenueCat] API Key bulunamadı, başlatılamadı.');
      return;
    }

    await Purchases.configure({ apiKey, appUserID: userId });
    console.log('[RevenueCat] Başarıyla başlatıldı.');
  } catch (error) {
    console.error('[RevenueCat] Başlatma hatası:', error);
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  if (!isNative()) return null;
  try {
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Müşteri bilgisi alınamadı:', error);
    return null;
  }
};

export const checkIsPro = async (): Promise<boolean> => {
  const info = await getCustomerInfo();
  if (!info) return false;
  return typeof info.entitlements.active[REVENUECAT_ENTITLEMENT] !== 'undefined';
};

export const fetchOfferings = async () => {
  if (!isNative()) return null;
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.error('[RevenueCat] Paketler alınamadı:', error);
    return [];
  }
};

export const purchasePackage = async (pack: PurchasesPackage): Promise<CustomerInfo | null> => {
  if (!isNative()) return null;
  try {
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pack });
    return customerInfo;
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('[RevenueCat] Kullanıcı satın almayı iptal etti.');
      return null;
    }
    console.error('[RevenueCat] Satın alma hatası:', error);
    throw error;
  }
};

export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  if (!isNative()) return null;
  try {
    const { customerInfo } = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Geri yükleme hatası:', error);
    throw error;
  }
};
