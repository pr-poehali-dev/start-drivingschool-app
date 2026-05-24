import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const TABS = [
  { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
  { id: 'journal', label: 'Журнал', icon: 'ClipboardList' },
];

type JournalEntry = {
  date: string;
  hours: number;
  grade: number;
  comment: string;
};

type Student = {
  id: number;
  name: string;
  category: string;
  totalHours: number;
  requiredHours: number;
  journal: JournalEntry[];
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1, name: 'Иван Петров', category: 'B', totalHours: 12, requiredHours: 54,
    journal: [
      { date: '15.05', hours: 2, grade: 5, comment: 'Уверенное вождение на площадке' },
      { date: '18.05', hours: 2, grade: 4, comment: 'Трудности с параллельной парковкой' },
      { date: '22.05', hours: 2, grade: 5, comment: 'Хорошо проехал по городу' },
    ],
  },
  {
    id: 2, name: 'Мария Сидорова', category: 'B', totalHours: 8, requiredHours: 54,
    journal: [
      { date: '16.05', hours: 2, grade: 3, comment: 'Первый выезд — волнение' },
      { date: '20.05', hours: 2, grade: 4, comment: 'Лучше держит дистанцию' },
      { date: '23.05', hours: 2, grade: 4, comment: 'Прогресс очевиден' },
    ],
  },
  {
    id: 3, name: 'Дмитрий Козлов', category: 'B', totalHours: 22, requiredHours: 54,
    journal: [
      { date: '14.05', hours: 2, grade: 5, comment: 'Отличный темп' },
      { date: '17.05', hours: 2, grade: 5, comment: 'Самостоятельное принятие решений' },
    ],
  },
];

const SCHEDULE_WEEK = [
  { day: 'Пн', date: '26 мая', slots: [
    { time: '09:00', student: 'Иван Петров', type: 'Город', filled: true },
    { time: '11:00', student: null, type: null, filled: false },
    { time: '14:00', student: 'Мария Сидорова', type: 'Площадка', filled: true },
  ]},
  { day: 'Вт', date: '27 мая', slots: [
    { time: '10:00', student: 'Дмитрий Козлов', type: 'Город', filled: true },
    { time: '13:00', student: null, type: null, filled: false },
    { time: '16:00', student: null, type: null, filled: false },
  ]},
  { day: 'Ср', date: '28 мая', slots: [
    { time: '09:00', student: null, type: null, filled: false },
    { time: '11:00', student: 'Иван Петров', type: 'Экзамен', filled: true },
    { time: '15:00', student: 'Мария Сидорова', type: 'Город', filled: true },
  ]},
  { day: 'Чт', date: '29 мая', slots: [
    { time: '09:00', student: 'Дмитрий Козлов', type: 'Площадка', filled: true },
    { time: '11:00', student: null, type: null, filled: false },
    { time: '14:00', student: null, type: null, filled: false },
  ]},
  { day: 'Пт', date: '30 мая', slots: [
    { time: '10:00', student: 'Иван Петров', type: 'Город', filled: true },
    { time: '12:00', student: null, type: null, filled: false },
    { time: '15:00', student: 'Дмитрий Козлов', type: 'Город', filled: true },
  ]},
];

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('schedule');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({ date: '', hours: 2, grade: 5, comment: '' });
  const [addingEntry, setAddingEntry] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('start_user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('start_user');
    navigate('/');
  };

  const saveEntry = () => {
    if (!selectedStudent || !newEntry.date) return;
    const entry: JournalEntry = { ...newEntry };
    setStudents(prev => prev.map(s =>
      s.id === selectedStudent.id
        ? { ...s, totalHours: s.totalHours + newEntry.hours, journal: [...s.journal, entry] }
        : s
    ));
    setSelectedStudent(prev => prev ? {
      ...prev,
      totalHours: prev.totalHours + newEntry.hours,
      journal: [...prev.journal, entry],
    } : null);
    setNewEntry({ date: '', hours: 2, grade: 5, comment: '' });
    setAddingEntry(false);
  };

  if (!user) return null;

  const renderTab = () => {
    switch (tab) {
      case 'schedule':
        return (
          <div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-3 min-w-[700px]">
                {SCHEDULE_WEEK.map((day, di) => (
                  <div key={di} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 text-center">
                      <div className="font-montserrat font-bold text-sm text-gray-900">{day.day}</div>
                      <div className="text-xs text-gray-400">{day.date}</div>
                    </div>
                    <div className="p-2 space-y-2">
                      {day.slots.map((slot, si) => (
                        <div key={si} className={`rounded-lg p-2 text-xs ${slot.filled ? 'bg-burgundy/10 border border-burgundy/20' : 'bg-gray-50 border border-dashed border-gray-200'}`}>
                          <div className={`font-semibold ${slot.filled ? 'text-burgundy' : 'text-gray-300'}`}>{slot.time}</div>
                          {slot.filled ? (
                            <>
                              <div className="text-gray-700 font-medium mt-0.5 leading-tight">{slot.student}</div>
                              <div className="text-gray-400 mt-0.5">{slot.type}</div>
                            </>
                          ) : (
                            <div className="text-gray-300 mt-0.5">Свободно</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'journal':
        return (
          <div className="flex gap-6">
            <div className="w-56 shrink-0 space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-wider px-1 mb-3">Мои ученики</div>
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                    selectedStudent?.id === s.id ? 'bg-burgundy/10 border border-burgundy/20' : 'bg-white border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Кат. {s.category} · {s.totalHours}/{s.requiredHours} ч</div>
                  <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-burgundy rounded-full" style={{ width: `${(s.totalHours / s.requiredHours) * 100}%` }} />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex-1">
              {!selectedStudent ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  <div className="text-center">
                    <Icon name="Users" size={32} className="mx-auto mb-2 text-gray-200" />
                    Выберите ученика
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-montserrat font-semibold text-gray-900">{selectedStudent.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {selectedStudent.totalHours} из {selectedStudent.requiredHours} часов
                      </p>
                    </div>
                    <button
                      onClick={() => setAddingEntry(true)}
                      className="flex items-center gap-1.5 text-xs bg-burgundy text-white px-3 py-1.5 rounded-lg hover:bg-burgundy-light transition-all"
                    >
                      <Icon name="Plus" size={13} />
                      Добавить запись
                    </button>
                  </div>

                  {addingEntry && (
                    <div className="px-6 py-4 bg-burgundy/5 border-b border-burgundy/10">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Дата</label>
                          <input
                            type="text"
                            placeholder="напр. 26.05"
                            value={newEntry.date}
                            onChange={e => setNewEntry(n => ({ ...n, date: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Часов</label>
                          <select
                            value={newEntry.hours}
                            onChange={e => setNewEntry(n => ({ ...n, hours: +e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-burgundy/30"
                          >
                            {[1,2,3,4].map(h => <option key={h} value={h}>{h} ч</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Оценка</label>
                          <select
                            value={newEntry.grade}
                            onChange={e => setNewEntry(n => ({ ...n, grade: +e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-burgundy/30"
                          >
                            {[3,4,5].map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Комментарий</label>
                          <input
                            type="text"
                            placeholder="Краткая заметка"
                            value={newEntry.comment}
                            onChange={e => setNewEntry(n => ({ ...n, comment: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy/30"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEntry} className="text-xs bg-burgundy text-white px-4 py-1.5 rounded-lg hover:bg-burgundy-light">Сохранить</button>
                        <button onClick={() => setAddingEntry(false)} className="text-xs text-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-100">Отмена</button>
                      </div>
                    </div>
                  )}

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Часов</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Оценка</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Комментарий</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedStudent.journal.map((entry, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-6 py-3 text-gray-600">{entry.date}</td>
                          <td className="px-6 py-3 text-gray-600">{entry.hours} ч</td>
                          <td className="px-6 py-3">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, si) => (
                                <Icon key={si} name="Star" size={12} className={si < entry.grade ? 'text-yellow-400' : 'text-gray-200'} />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-gray-500 text-xs">{entry.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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
          <div className="text-xs text-gray-400 px-2 mb-1">Инструктор</div>
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
        <span className="font-montserrat font-bold text-gray-900 text-sm">Кабинет инструктора</span>
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
