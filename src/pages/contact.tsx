import ContactSidebar from '../components/contact/ContactSidebar';
import ContactHeader from '../components/contact/ContactHeader';
import { usePageTitle } from '../hooks/usePageTitle';

import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import TicketManager from '../components/contact/TicketManager';

export default function Contact() {
  usePageTitle('İletişim & Destek');
  const { user } = useAppStore();

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">
      <ContactHeader />
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {user ? (
          <TicketManager />
        ) : (
          <div className="md:col-span-2 bg-[#16191d] rounded-2xl shadow-2xl border border-base-300 p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Giriş Yapmanız Gerekiyor</h3>
            <p className="text-base-content/70 mb-6">Destek talebi oluşturmak veya öneri göndermek için sisteme giriş yapmış olmanız gerekmektedir.</p>
            <Link to="/login" className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/40 w-full sm:w-auto px-8">
              Giriş Yap
            </Link>
          </div>
        )}
        <ContactSidebar />
      </div>
    </div>
  );
}
