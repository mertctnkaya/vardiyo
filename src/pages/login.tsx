import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { usePageTitle } from '../hooks/usePageTitle';
import Alert from '../components/shared/Alert';

export default function Login() {
  usePageTitle('Giriş Yap');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("E-posta veya şifre hatalı.");
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in w-full mt-10 sm:mt-20 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">

        <div className="bg-base-200 border-b border-base-300 p-6 text-center">
          <h2 className="text-3xl font-black text-indigo-500 tracking-wide">Vardiyo</h2>
          <p className="text-sm text-base-content/60 mt-2">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-6">

          {errorMsg && (
            <Alert color="red" icon="warning">
              {errorMsg}
            </Alert>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold text-base-content/80">E-posta Adresi</span>
            </label>
            <input
              type="email"
              placeholder="ornek@email.com"
              className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label pb-1"><span className="label-text font-bold text-base-content/80">Şifre</span></label>
            <input
              type="password"
              placeholder="••••••"
              className="input input-bordered w-full bg-base-200 focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="label pt-2 pb-0 justify-end">
              <Link to="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Şifremi Unuttum</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-lg shadow-indigo-900/50 mt-4"
          >
            {loading ? <span className="loading loading-spinner"></span> : 'Giriş Yap'}
          </button>
        </form>

        <div className="bg-base-200 border-t border-base-300 p-4 text-center">
          <p className="text-sm text-base-content/70">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Hemen Kayıt Olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}