import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isNative } from '../utils/isNative';

export function useMobileBackHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isNative()) return;

    let isMounted = true;
    let removeListener: (() => void) | undefined;

    import('@capacitor/app').then(({ App }) => {
      if (!isMounted) return;

      const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
        // 1. Çekmece menü açıksa önce onu kapat
        const drawerCheckbox = document.getElementById('mobile-drawer') as HTMLInputElement | null;
        if (drawerCheckbox && drawerCheckbox.checked) {
          drawerCheckbox.checked = false;
          return;
        }

        // 2. Açık herhangi bir modal veya diyalog varsa onu kapat
        const openModalCloseBtn = document.querySelector(
          '.modal-open .btn-circle, [role="dialog"] .btn-circle, .fixed .btn-circle'
        ) as HTMLButtonElement | null;
        if (openModalCloseBtn) {
          openModalCloseBtn.click();
          return;
        }

        // 3. Alt sayfadaysak ana sayfaya / bir önceki sayfaya dön
        if (location.pathname !== '/') {
          navigate(-1);
          return;
        }

        // 4. Ana sayfadaysak uygulamadan çık / arka plana al
        if (!canGoBack || location.pathname === '/') {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      removeListener = () => {
        listenerPromise.then(handle => handle.remove());
      };
    }).catch(err => {
      console.warn('[useMobileBackHandler] Capacitor App plugin not available:', err);
    });

    return () => {
      isMounted = false;
      if (removeListener) removeListener();
    };
  }, [navigate, location.pathname]);
}

