import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { login as apiLogin } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', pass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await apiLogin(form.login, form.pass);
      localStorage.setItem('start_user', JSON.stringify(user));
      if (user.role === 'student') navigate('/student');
      else if (user.role === 'instructor') navigate('/instructor');
      else if (user.role === 'admin') navigate('/admin');
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-burgundy rounded-lg flex items-center justify-center">
              <span className="text-white font-montserrat font-black text-lg">С</span>
            </div>
          </Link>
          <h1 className="font-montserrat font-bold text-2xl text-gray-900">Войти в кабинет</h1>
          <p className="text-gray-500 text-sm mt-1">Автошкола «Старт»</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Логин</label>
              <input
                type="text"
                value={form.login}
                onChange={e => { setForm({ ...form, login: e.target.value }); setError(''); }}
                placeholder="Введите логин"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
              <input
                type="password"
                value={form.pass}
                onChange={e => { setForm({ ...form, pass: e.target.value }); setError(''); }}
                placeholder="Введите пароль"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                <Icon name="AlertCircle" size={15} />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-burgundy hover:bg-burgundy-light text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <><Icon name="Loader2" size={16} className="animate-spin" />Входим...</> : 'Войти'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-medium text-gray-600 mb-1">Демо-доступ:</p>
            <p>Ученик: <span className="font-mono bg-white px-1 rounded">student / 123</span></p>
            <p>Инструктор: <span className="font-mono bg-white px-1 rounded">instructor / 123</span></p>
            <p>Администратор: <span className="font-mono bg-white px-1 rounded">admin / 123</span></p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link to="/" className="text-burgundy hover:underline">← На сайт</Link>
        </p>
      </div>
    </div>
  );
}
