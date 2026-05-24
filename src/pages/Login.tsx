import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const DEMO_USERS = [
  { login: 'student', pass: '123', role: 'student', name: 'Иван Петров' },
  { login: 'instructor', pass: '123', role: 'instructor', name: 'Александр Петров' },
  { login: 'admin', pass: '123', role: 'admin', name: 'Администратор' },
];

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', pass: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DEMO_USERS.find(u => u.login === form.login && u.pass === form.pass);
    if (user) {
      localStorage.setItem('start_user', JSON.stringify(user));
      if (user.role === 'student') navigate('/student');
      if (user.role === 'instructor') navigate('/instructor');
      if (user.role === 'admin') navigate('/admin');
    } else {
      setError('Неверный логин или пароль');
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
              className="w-full bg-burgundy hover:bg-burgundy-light text-white font-semibold py-3 rounded-xl transition-all"
            >
              Войти
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
