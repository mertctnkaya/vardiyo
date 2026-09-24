import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import MainLayout from './components/layout/MainLayout';
import CurrentShift from './pages/currentShift';
import NextWeeks from './pages/nextWeeks';
import WorktimeCalendar from './pages/worktimeCalendar';
import Settings from './pages/settings';
import Profile from './pages/profile';
import Calculations from './pages/calculations';
import Login from './pages/login';
import Register from './pages/register';
import FAQ from './pages/faq';
import Contact from './pages/contact';
import Admin from './pages/admin';
import ForgotPassword from './pages/forgotPassword';
import UpdatePassword from './pages/updatePassword';
import PrivacyPolicy from './pages/privacy';
import TermsOfService from './pages/terms';
import NotFound from './pages/NotFound';
import CVBuilderPage from './pages/cv-builder';

import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { initRevenueCat, checkIsPro, getCustomerInfo, REVENUECAT_ENTITLEMENT } from './services/revenuecat';
import { updateUserSettings } from './services/dbService';

export default function App() {
  const { user, settings, setSettings, setIsRevenueCatPro } = useAppStore();

  useEffect(() => {
    const setupRevenueCat = async () => {
      await initRevenueCat(user?.id);
      const isPro = await checkIsPro();
      setIsRevenueCatPro(isPro);

      if (isPro && user) {
        const customerInfo = await getCustomerInfo();
        const entitlement = customerInfo?.entitlements.active[REVENUECAT_ENTITLEMENT];
        const expirationDate = entitlement?.expirationDate || '2099-12-31T23:59:59Z';

        if (!settings?.premium_until || new Date(settings.premium_until) < new Date(expirationDate)) {
          const { data } = await updateUserSettings(user.id, {
            role: settings?.role === 'admin' ? 'admin' : 'premium',
            premium_until: expirationDate,
          });
          if (data) setSettings(data);
        }
      }
    };
    setupRevenueCat();
  }, [user?.id, setIsRevenueCatPro, settings?.premium_until, settings?.role, setSettings]);

  return (
    <BrowserRouter>
      <Analytics />
      <SpeedInsights />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<CurrentShift />} />
          <Route path="next-weeks" element={<NextWeeks />} />
          <Route path="worktime" element={<WorktimeCalendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="calculations" element={<Calculations />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="cv-builder" element={<CVBuilderPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
