import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import StudentOverview from './StudentOverview';
import StudentPDD from './StudentPDD';
import StudentCalendar from './StudentCalendar';
import StudentProgress from './StudentProgress';
import StudentReview from './StudentReview';

const TABS = [
  { id: 'overview', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'pdd', label: 'ПДД тесты', icon: 'BookOpen' },
  { id: 'calendar', label: 'Запись', icon: 'Calendar' },
  { id: 'progress', label: 'Прогресс', icon: 'TrendingUp' },
  { id: 'review', label: 'Оставить отзыв', icon: 'Star' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('start_user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('start_user');
    navigate('/');
  };

  if (!user) return null;

  const renderTab = () => {
    switch (tab) {
      case 'overview':  return <StudentOverview userName={user.name} />;
      case 'pdd':       return <StudentPDD />;
      case 'calendar':  return <StudentCalendar />;
      case 'progress':  return <StudentProgress />;
      case 'review':    return <StudentReview />;
      default:          return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 shrink-0">
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-burgundy rounded flex items-center justify-center">
              <span className="text-white font-montserrat font-black text-xs">С</span>
            </div>
            <span className="font-montserrat font-bold text-gray-900 text-sm">Старт</span>
          </Link>
        </div>
        <div className="p-3 border-b border-gray-100">
          <div className="text-xs text-gray-400 px-2 mb-1">Ученик</div>
          <div className="font-medium text-sm text-gray-900 px-2">{user.name}</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                tab === t.id ? 'bg-burgundy/10 text-burgundy font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Icon name="LogOut" size={15} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="font-montserrat font-bold text-gray-900 text-sm">Кабинет ученика</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={22} />
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-14 p-4">
          <nav className="space-y-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm transition-all ${
                  tab === t.id ? 'bg-burgundy/10 text-burgundy font-medium' : 'text-gray-600'
                }`}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-3 text-sm text-gray-400">
              <Icon name="LogOut" size={15} />
              Выйти
            </button>
          </nav>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        <div className="mb-6">
          <h1 className="font-montserrat font-bold text-xl text-gray-900">
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          {tab === 'overview' && <p className="text-sm text-gray-400 mt-0.5">Добро пожаловать, {user.name}</p>}
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
