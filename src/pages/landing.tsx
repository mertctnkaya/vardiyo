import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Landing() {
  const { user, settings } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If authenticated and "active" (has settings with a shift_type or work_type), bypass landing
    if (user && settings?.work_type) {
      navigate('/currentShift', { replace: true });
    }
  }, [user, settings, navigate]);

  if (!user) {
    // Vibrant Marketing Layout for Guests
    return (
      <div className="w-full relative overflow-hidden flex flex-col items-center pb-20 bg-[#0f1115]">
        
        {/* Ambient Background Glows */}
        <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Hero Section */}
        <div className="w-full max-w-5xl mx-auto px-4 pt-28 md:pt-36 pb-16 text-center relative z-10">
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Vardiyanızı <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 drop-shadow-sm">
              Zekice Yönetin
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-base-content/70 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Türkiye'nin en kapsamlı vardiya, mesai ve bordro asistanı. Yasal mevzuata tam uyumlu maaş hesaplamaları, nöbet çizelgeleri ve profesyonel CV oluşturucu tek bir platformda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
            <Link to="/register" className="btn btn-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white border-none shadow-[0_0_30px_rgba(99,102,241,0.4)] rounded-2xl px-10 w-full sm:w-auto h-14 transition-all hover:scale-105">
              Ücretsiz Kayıt Ol
            </Link>
            <Link to="/currentShift" className="btn btn-lg btn-outline border-base-300 hover:border-indigo-500/50 hover:bg-indigo-950/40 text-base-content rounded-2xl px-8 w-full sm:w-auto h-14 backdrop-blur-sm group">
              Misafir Olarak Dene
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-base-content/50 font-medium">
            💡 Sisteme giriş yapmadan, misafir olarak örnek bir <span className="text-indigo-400">3'lü vardiya döngüsü</span> üzerinden uygulamamızı deneyip görebilirsiniz.
          </p>
        </div>

        {/* Dynamic Feature Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="group relative bg-[#121418]/80 backdrop-blur-xl border border-base-300 hover:border-emerald-500/50 p-8 rounded-[2rem] shadow-xl transition-all hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-0"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform text-emerald-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Kuruşu Kuruşuna Bordro</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">
                Asgari ücret, vergi dilimleri, SGK primleri, BES kesintileri ve gece zammı gibi tüm yasal parametreleri gözeterek net/brüt kazancınızı kuruşu kuruşuna hesaplayın.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-[#121418]/80 backdrop-blur-xl border border-base-300 hover:border-amber-500/50 p-8 rounded-[2rem] shadow-xl transition-all hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)] hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-0"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform text-amber-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tazminat & Yasal Haklar</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">
                İş Kanunu 4857'ye tam uyumlu motorumuzla; kıdem tazminatı, ihbar süresi hesaplamaları ve istifa/fesih senaryolarına saniyeler içinde erişim sağlayın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-[#121418]/80 backdrop-blur-xl border border-base-300 hover:border-indigo-500/50 p-8 rounded-[2rem] shadow-xl transition-all hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)] hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-0"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform text-indigo-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Akıllı CV Motoru (ATS)</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">
                Dünya standartlarında, Kurumsal İK sistemlerinin (ATS) %90 oranında sorunsuz okuyabileceği profesyonel CV'nizi dakikalar içinde PDF olarak oluşturun.
              </p>
            </div>

          </div>
        </div>

        {/* Social Proof / Ad Banner Section */}
        <div className="w-full max-w-5xl mx-auto px-4 mt-8 relative z-10">
          <div className="bg-gradient-to-br from-[#121418] to-[#1a1d24] border border-indigo-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
            
            {/* Banner Deco */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none"></div>

            <div className="flex-1 relative z-10">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Bir Sürü Araç Tek Bir Yerde!</h2>
              <ul className="text-base-content/70 text-base md:text-lg mb-6 space-y-2">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Fazla Mesai ve Tatil Çarpanları</li>
                <li className="flex items-center gap-2"><span className="text-indigo-400">✓</span> Kişiselleştirilmiş Vardiya Döngüleri</li>
                <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Detaylı Bordro ve Kesinti Analizleri</li>
              </ul>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link to="/register" className="btn bg-white hover:bg-gray-200 text-indigo-900 border-none rounded-xl px-8 shadow-lg">
                  Hesap Oluştur
                </Link>
                <Link to="/login" className="btn btn-ghost text-indigo-300 hover:bg-indigo-900/30 hover:text-white rounded-xl">
                  Giriş Yap
                </Link>
              </div>
            </div>
            
            {/* Visual element */}
            <div className="hidden md:flex flex-col gap-3 relative z-10">
               <div className="bg-[#1e2329] p-4 rounded-2xl border border-base-300 shadow-lg flex items-center gap-4 w-64 transform rotate-3 hover:rotate-0 transition-transform">
                 <div className="w-10 h-10 bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-400">₺</div>
                 <div>
                   <p className="text-xs text-base-content/50">Tahmini Net Maaş</p>
                   <p className="text-lg font-bold text-white">42.500 ₺</p>
                 </div>
               </div>
               <div className="bg-[#1e2329] p-4 rounded-2xl border border-base-300 shadow-lg flex items-center gap-4 w-64 transform -rotate-2 hover:rotate-0 transition-transform ml-8">
                 <div className="w-10 h-10 bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-400">⏱</div>
                 <div>
                   <p className="text-xs text-base-content/50">Fazla Mesai</p>
                   <p className="text-lg font-bold text-white">12 Saat</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Onboarding layout for "fresh" users (user && !settings?.work_type)
  return (
    <div className="w-full relative overflow-hidden flex flex-col items-center pt-28 pb-10 md:pt-36 md:pb-20 px-4 bg-[#0f1115]">
      
      {/* Background glow */}
      <div className="absolute top-[0%] left-[20%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-[#1a1d24] to-[#16191d] border border-indigo-500/30 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10">
        
        {/* Header Section */}
        <div className="px-6 sm:px-8 pt-12 pb-8 text-center border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
          
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-900/40 to-indigo-800/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="text-4xl animate-bounce">👋</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
            Hoş Geldiniz, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user.user_metadata?.name?.split(' ')[0] || 'Değerli Kullanıcımız'}</span>!
          </h1>
          <p className="text-base-content/70 max-w-xl mx-auto text-base sm:text-lg">
            Hesabınız başarıyla oluşturuldu. Ancak sistemimizin sizin için <b>doğru maaş, mesai ve nöbet hesaplamaları</b> yapabilmesi için öncelikle çalışma profilinizi kaydetmeniz gerekiyor.
          </p>
        </div>

        {/* Steps Section */}
        <div className="p-6 sm:p-10">
          <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-widest mb-8 text-center">Nereden Başlamalıyım?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#121418] border border-indigo-500/30 rounded-2xl p-6 relative shadow-lg shadow-indigo-900/10 hover:-translate-y-1 transition-transform">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black border-4 border-[#1a1d24] shadow-lg">1</div>
              <div className="text-indigo-400 mb-4 bg-indigo-900/20 w-12 h-12 flex items-center justify-center rounded-xl border border-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 className="font-bold text-white mb-2 text-lg">Çalışma Ayarları</h4>
              <p className="text-sm text-base-content/60 mb-6">Öncelikle maaşınızı, vardiya tipinizi ve dinlenme günlerinizi sisteme tanımlayın.</p>
              <Link to="/settings" className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/40 rounded-xl">Hemen Ayarla</Link>
            </div>

            {/* Step 2 */}
            <div className="bg-[#121418] border border-base-300 rounded-2xl p-6 relative hover:border-emerald-500/30 transition-colors">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-base-300 text-base-content rounded-xl flex items-center justify-center font-black border-4 border-[#1a1d24]">2</div>
              <div className="text-emerald-400 mb-4 bg-emerald-900/10 w-12 h-12 flex items-center justify-center rounded-xl border border-emerald-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-bold text-white mb-2 text-lg">Takvime İşle</h4>
              <p className="text-sm text-base-content/60 mb-6">Ayarlarınızı kaydettikten sonra, günlük mesailerinizi veya izinlerinizi takvimden ekleyin.</p>
              <Link to="/worktime" className="btn w-full btn-outline border-base-300 hover:border-emerald-500/50 hover:bg-emerald-950/30 text-base-content rounded-xl">Takvimi Aç</Link>
            </div>

            {/* Step 3 */}
            <div className="bg-[#121418] border border-base-300 rounded-2xl p-6 relative hover:border-amber-500/30 transition-colors">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-base-300 text-base-content rounded-xl flex items-center justify-center font-black border-4 border-[#1a1d24]">3</div>
              <div className="text-amber-400 mb-4 bg-amber-900/10 w-12 h-12 flex items-center justify-center rounded-xl border border-amber-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="font-bold text-white mb-2 text-lg">Sonuçları Gör</h4>
              <p className="text-sm text-base-content/60 mb-6">Verileri girdikten sonra kıdem, ihbar ve tahmini net maaş raporlarınızı canlı olarak takip edin.</p>
              <Link to="/calculations" className="btn w-full btn-outline border-base-300 hover:border-amber-500/50 hover:bg-amber-950/30 text-base-content rounded-xl">Hesaplamalar</Link>
            </div>

          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-indigo-950/10 p-6 md:p-8 text-center border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-base text-indigo-200/70">Uygulamanın mantığını ve yasal haklarınızı öğrenmek ister misiniz?</p>
          <Link to="/faq" className="btn btn-sm btn-ghost text-indigo-400 hover:bg-indigo-900/30 rounded-lg">S.S.S ve Haklar Rehberi ➔</Link>
        </div>

      </div>
    </div>
  );
}
