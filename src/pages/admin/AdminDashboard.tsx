import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const TABS = [
  { id: 'overview', label: 'Обзор', icon: 'LayoutDashboard' },
  { id: 'groups', label: 'Группы', icon: 'Users' },
  { id: 'applications', label: 'Заявки', icon: 'FileText' },
  { id: 'documents', label: 'Документы', icon: 'FolderOpen' },
];

type Application = {
  id: number;
  name: string;
  phone: string;
  email: string;
  category: string;
  date: string;
  status: 'new' | 'contacted' | 'enrolled' | 'rejected';
};

type Student = {
  id: number;
  name: string;
  phone: string;
  category: string;
  hours: number;
  docs: { passport: boolean; photo: boolean; medical: boolean; contract: boolean };
};

type Group = {
  id: number;
  name: string;
  category: string;
  instructor: string;
  start: string;
  students: Student[];
};

const INITIAL_GROUPS: Group[] = [
  {
    id: 1, name: 'Группа Б-1', category: 'B', instructor: 'Александр Петров', start: 'Март 2026',
    students: [
      { id: 1, name: 'Иван Петров', phone: '+7-900-000-01', category: 'B', hours: 12, docs: { passport: true, photo: true, medical: true, contract: true } },
      { id: 2, name: 'Мария Сидорова', phone: '+7-900-000-02', category: 'B', hours: 8, docs: { passport: true, photo: true, medical: false, contract: true } },
      { id: 3, name: 'Дмитрий Козлов', phone: '+7-900-000-03', category: 'B', hours: 22, docs: { passport: true, photo: true, medical: true, contract: true } },
    ],
  },
  {
    id: 2, name: 'Группа Б-2', category: 'B', instructor: 'Михаил Сидоров', start: 'Апрель 2026',
    students: [
      { id: 4, name: 'Анна Кузнецова', phone: '+7-900-000-04', category: 'B', hours: 5, docs: { passport: true, photo: false, medical: false, contract: true } },
      { id: 5, name: 'Сергей Морозов', phone: '+7-900-000-05', category: 'B', hours: 3, docs: { passport: true, photo: true, medical: false, contract: false } },
    ],
  },
  {
    id: 3, name: 'Группа А-1', category: 'A', instructor: 'Ольга Иванова', start: 'Май 2026',
    students: [
      { id: 6, name: 'Алексей Новиков', phone: '+7-900-000-06', category: 'A', hours: 2, docs: { passport: true, photo: true, medical: true, contract: true } },
    ],
  },
];

const INITIAL_APPS: Application[] = [
  { id: 1, name: 'Павел Жуков', phone: '+7-900-111-22', email: 'zhukov@mail.ru', category: 'B', date: '24.05.2026', status: 'new' },
  { id: 2, name: 'Екатерина Лебедева', phone: '+7-900-222-33', email: 'lebedeva@mail.ru', category: 'A', date: '23.05.2026', status: 'contacted' },
  { id: 3, name: 'Роман Смирнов', phone: '+7-900-333-44', email: 'smirnov@mail.ru', category: 'B', date: '22.05.2026', status: 'enrolled' },
  { id: 4, name: 'Наталья Фёдорова', phone: '+7-900-444-55', email: 'fedorova@mail.ru', category: 'B', date: '20.05.2026', status: 'new' },
];

const STATUS_LABELS: Record<Application['status'], { label: string; cls: string }> = {
  new: { label: 'Новая', cls: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Связались', cls: 'bg-yellow-100 text-yellow-700' },
  enrolled: { label: 'Зачислен', cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Отказ', cls: 'bg-red-100 text-red-700' },
};

const DOC_LABELS = ['Паспорт', 'Фото', 'Медсправка', 'Договор'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
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

  const toggleDoc = (groupId: number, studentId: number, docKey: keyof Student['docs']) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, students: g.students.map(s => s.id === studentId ? { ...s, docs: { ...s.docs, [docKey]: !s.docs[docKey] } } : s) }
        : g
    ));
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => prev ? {
        ...prev,
        students: prev.students.map(s => s.id === studentId ? { ...s, docs: { ...s.docs, [docKey]: !s.docs[docKey] } } : s)
      } : null);
    }
  };

  const updateAppStatus = (id: number, status: Application['status']) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  if (!user) return null;

  const allStudents = groups.flatMap(g => g.students);
  const totalHours = allStudents.reduce((s, st) => s + st.hours, 0);
  const docsComplete = allStudents.filter(s => Object.values(s.docs).every(Boolean)).length;
  const newApps = apps.filter(a => a.status === 'new').length;

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: 'Users', label: 'Учеников', val: allStudents.length, color: 'text-burgundy' },
                { icon: 'BookOpen', label: 'Групп', val: groups.length, color: 'text-blue-600' },
                { icon: 'Bell', label: 'Новых заявок', val: newApps, color: 'text-orange-600' },
                { icon: 'FileCheck', label: 'Документы OK', val: docsComplete, color: 'text-green-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name={s.icon} size={18} className={s.color} />
                    <span className="text-xs text-gray-400">{s.label}</span>
                  </div>
                  <div className="font-montserrat font-black text-3xl text-gray-900">{s.val}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-montserrat font-semibold text-gray-900 mb-4">Группы</h3>
                <div className="space-y-3">
                  {groups.map(g => (
                    <div key={g.id} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{g.name}</div>
                        <div className="text-xs text-gray-400">{g.instructor} · {g.students.length} уч.</div>
                      </div>
                      <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">Кат. {g.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-montserrat font-semibold text-gray-900 mb-4">Новые заявки</h3>
                <div className="space-y-3">
                  {apps.filter(a => a.status === 'new').map(a => (
                    <div key={a.id} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{a.name}</div>
                        <div className="text-xs text-gray-400">{a.phone} · Кат. {a.category}</div>
                      </div>
                      <button
                        onClick={() => { updateAppStatus(a.id, 'contacted'); }}
                        className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-200 transition-all"
                      >
                        Связаться
                      </button>
                    </div>
                  ))}
                  {!apps.some(a => a.status === 'new') && (
                    <p className="text-sm text-gray-400">Новых заявок нет</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'groups':
        return (
          <div className="flex gap-6">
            <div className="w-56 shrink-0 space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-wider px-1 mb-3">Группы</div>
              {groups.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroup(g)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                    selectedGroup?.id === g.id ? 'bg-burgundy/10 border border-burgundy/20' : 'bg-white border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{g.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{g.instructor}</div>
                  <div className="text-xs text-gray-400">{g.students.length} учеников · {g.start}</div>
                </button>
              ))}
            </div>

            <div className="flex-1">
              {!selectedGroup ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm text-center">
                  <div>
                    <Icon name="Users" size={32} className="mx-auto mb-2 text-gray-200" />
                    Выберите группу
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="font-montserrat font-semibold text-gray-900">{selectedGroup.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Инструктор: {selectedGroup.instructor} · Начало: {selectedGroup.start}</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ученик</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Часы</th>
                          {DOC_LABELS.map(d => (
                            <th key={d} className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase">{d}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedGroup.students.map(s => {
                          const docKeys: (keyof Student['docs'])[] = ['passport', 'photo', 'medical', 'contract'];
                          return (
                            <tr key={s.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-3">
                                <div className="font-medium text-gray-900">{s.name}</div>
                                <div className="text-xs text-gray-400">{s.phone}</div>
                              </td>
                              <td className="px-6 py-3">
                                <div className="text-gray-700">{s.hours} ч</div>
                                <div className="h-1 w-16 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-burgundy rounded-full" style={{ width: `${(s.hours / 54) * 100}%` }} />
                                </div>
                              </td>
                              {docKeys.map(dk => (
                                <td key={dk} className="px-3 py-3 text-center">
                                  <button onClick={() => toggleDoc(selectedGroup.id, s.id, dk)}>
                                    <Icon
                                      name={s.docs[dk] ? 'CheckCircle' : 'Circle'}
                                      size={18}
                                      className={s.docs[dk] ? 'text-green-500' : 'text-gray-200'}
                                    />
                                  </button>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-montserrat font-semibold text-gray-900">Все заявки</h3>
              <span className="text-xs text-gray-400">{apps.length} заявок</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ФИО</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Контакт</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Категория</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {apps.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{a.name}</td>
                      <td className="px-6 py-3">
                        <div className="text-gray-600">{a.phone}</div>
                        <div className="text-xs text-gray-400">{a.email}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="bg-burgundy/10 text-burgundy text-xs px-2 py-0.5 rounded-full">Кат. {a.category}</span>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{a.date}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status].cls}`}>
                          {STATUS_LABELS[a.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={a.status}
                          onChange={e => updateAppStatus(a.id, e.target.value as Application['status'])}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-burgundy/30"
                        >
                          <option value="new">Новая</option>
                          <option value="contacted">Связались</option>
                          <option value="enrolled">Зачислить</option>
                          <option value="rejected">Отказ</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-5">
            {groups.map(g => (
              <div key={g.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-montserrat font-semibold text-gray-900 text-sm">{g.name}</h3>
                    <p className="text-xs text-gray-400">{g.instructor}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {g.students.filter(s => Object.values(s.docs).every(Boolean)).length}/{g.students.length} полных
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="px-5 py-2 text-left text-xs font-medium text-gray-400">Ученик</th>
                        {DOC_LABELS.map(d => (
                          <th key={d} className="px-3 py-2 text-center text-xs font-medium text-gray-400">{d}</th>
                        ))}
                        <th className="px-5 py-2 text-center text-xs font-medium text-gray-400">Готовность</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {g.students.map(s => {
                        const docKeys: (keyof Student['docs'])[] = ['passport', 'photo', 'medical', 'contract'];
                        const complete = Object.values(s.docs).every(Boolean);
                        return (
                          <tr key={s.id} className="hover:bg-gray-50/50">
                            <td className="px-5 py-2.5 font-medium text-gray-900">{s.name}</td>
                            {docKeys.map(dk => (
                              <td key={dk} className="px-3 py-2.5 text-center">
                                <button onClick={() => toggleDoc(g.id, s.id, dk)}>
                                  <Icon
                                    name={s.docs[dk] ? 'CheckCircle' : 'XCircle'}
                                    size={17}
                                    className={s.docs[dk] ? 'text-green-500' : 'text-red-300'}
                                  />
                                </button>
                              </td>
                            ))}
                            <td className="px-5 py-2.5 text-center">
                              {complete
                                ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Готово</span>
                                : <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Не хватает</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          <div className="text-xs text-gray-400 px-2 mb-1">Администратор</div>
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

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="font-montserrat font-bold text-gray-900 text-sm">Администратор</span>
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
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm ${tab === t.id ? 'bg-burgundy/10 text-burgundy font-medium' : 'text-gray-600'}`}
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

      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        <div className="mb-6">
          <h1 className="font-montserrat font-bold text-xl text-gray-900">
            {TABS.find(t => t.id === tab)?.label}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Добро пожаловать, {user.name}</p>
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
