import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV_LINKS = [
  { label: 'Главная', href: '/' },
  { label: 'Тарифы', href: '/tariffs' },
  { label: 'Как мы учим', href: '/how-we-teach' },
  { label: 'Инструкторы', href: '/instructors' },
  { label: 'Отзывы', href: '/reviews' },
  { label: 'Контакты', href: '/contacts' },
  { label: 'Заявка', href: '/apply' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith('/student') ||
    location.pathname.startsWith('/instructor') ||
    location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-burgundy rounded-sm flex items-center justify-center">
            <span className="text-white font-montserrat font-black text-sm">С</span>
          </div>
          <div>
            <span className="font-montserrat font-bold text-gray-900 text-lg leading-none block">Старт</span>
            <span className="text-xs text-gray-500 leading-none">автошкола</span>
          </div>
        </Link>

        {!isDashboard && (
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link text-sm font-medium text-gray-700 hover:text-burgundy transition-colors ${
                  location.pathname === link.href ? 'text-burgundy active' : ''
                } ${link.label === 'Заявка' ? 'bg-burgundy text-white px-4 py-2 rounded hover:bg-burgundy-light hover:text-white transition-colors' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!isDashboard && (
            <button
              onClick={() => navigate('/login')}
              className="hidden lg:flex items-center gap-1.5 text-sm text-gray-600 hover:text-burgundy transition-colors"
            >
              <Icon name="LogIn" size={16} />
              Войти
            </button>
          )}
          {isDashboard && (
            <button
              onClick={() => navigate('/')}
              className="hidden lg:flex items-center gap-1.5 text-sm text-gray-600 hover:text-burgundy transition-colors"
            >
              <Icon name="Globe" size={16} />
              На сайт
            </button>
          )}
          <button
            className="lg:hidden p-2 rounded text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'X' : 'Menu'} size={22} />
          </button>
        </div>
      </div>

      {open && !isDashboard && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm font-medium text-gray-700 hover:text-burgundy transition-colors border-b border-gray-50 ${
                location.pathname === link.href ? 'text-burgundy' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { navigate('/login'); setOpen(false); }}
            className="py-2 text-sm text-gray-500 hover:text-burgundy flex items-center gap-2"
          >
            <Icon name="LogIn" size={16} />
            Войти в кабинет
          </button>
        </div>
      )}
    </header>
  );
}
