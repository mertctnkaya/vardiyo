import { Capacitor } from '@capacitor/core';

export const isNative = () => {
  // Capacitor.isNativePlatform true ise Android veya iOS'tur.
  return Capacitor.isNativePlatform();
};