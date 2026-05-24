import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getInstructorStudents, postJournalEntry, getInstructorSchedule } from '@/lib/api';

const TABS = [
  { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
  { id: 'journal', label: 'Журнал', icon: 'ClipboardList' },
];

type JournalEntry = { id: number; date: string; hours: number; grade: number; comment: string };
type Student = { id: number; name: string; totalHours: number; requiredHours: number; journal: JournalEntry[] };
type ScheduleSlot = { id: number; date: string; time: string; status: string; student: string | null };

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('schedule');
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newEntry, setNewEntry] = useState({ date: '', hours: 2, grade: 5, comment: '' });
  const [addingEntry, setAddingEntry] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('start_user');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    Promise.all([
      getInstructorStudents(u.id).then(setStudents),
      getInstructorSchedule(u.id).then(setSchedule),
    ]).finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('start_user');
    navigate('/');
  };

  const saveEntry = async () => {
    if (!selectedStudent || !newEntry.date || !user) return;
    const res = await postJournalEntry({
      student_id: selectedStudent.id,
      instructor_id: user.id,
      lesson_date: newEntry.date,
      hours: newEntry.hours,
      grade: newEntry.grade,
      comment: newEntry.comment,
    });
    const entry: JournalEntry = { id: res.id, date: newEntry.date, hours: newEntry.hours, grade: newEntry.grade, comment: newEntry.comment };
    const updater = (s: Student) => s.id === selectedStudent.id
      ? { ...s, totalHours: s.totalHours + newEntry.hours, journal: [entry, ...s.journal] }
      : s;
    setStudents(prev => prev.map(updater));
    setSelectedStudent(prev => prev ? updater(prev) : null);
    setNewEntry({ date: '', hours: 2, grade: 5, comment: '' });
    setAddingEntry(false);
  };

  if (!user) return null;

  // Group schedule by day
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const scheduleByDay: Record<string, ScheduleSlot[]> = {};
  schedule.forEach(s => {
    const key = s.date;
    if (!scheduleByDay[key]) scheduleByDay[key] = [];
    scheduleByDay[key].push(s);
  });
  const scheduleDays = Object.entries(scheduleByDay).slice(0, 5);

  const renderTab = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        <Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...
      </div>
    );

    switch (tab) {
      case 'schedule':
        return (
          <div>
            <div className="overflow-x-auto">
              {scheduleDays.length === 0 ? (
                <div className="text-center text-gray-400 py-12 text-sm">Слотов нет</div>
              ) : (
                <div className="grid gap-3 min-w-[600px]" style={{ gridTemplateColumns: `repeat(${scheduleDays.length}, 1fr)` }}>
                  {scheduleDays.map(([date, slots]) => {
                    const d = new Date(date);
                    return (
                      <div key={date} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 text-center">
                          <div className="font-montserrat font-bold text-sm text-gray-900">{dayNames[d.getDay()]}</div>
                          <div className="text-xs text-gray-400">{d.getDate()} {d.toLocaleDateString('ru-RU', { month: 'short' })}</div>
                        </div>
                        <div className="p-2 space-y-2">
                          {slots.map(slot => (
                            <div key={slot.id} className={`rounded-lg p-2 text-xs ${slot.student ? 'bg-burgundy/10 border border-burgundy/20' : 'bg-gray-50 border border-dashed border-gray-200'}`}>
                              <div className={`font-semibold ${slot.student ? 'text-burgundy' : 'text-gray-300'}`}>{slot.time}</div>
                              {slot.student
                                ? <div className="text-gray-700 font-medium mt-0.5 leading-tight">{slot.student}</div>
                                : <div className="text-gray-300 mt-0.5">Свободно</div>
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'journal':
        return (
          <div className="flex gap-6">
            <div className="w-56 shrink-0 space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-wider px-1 mb-3">Мои ученики</div>
              {students.length === 0 && <p className="text-sm text-gray-400 px-1">Нет учеников</p>}
              {students.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                    selectedStudent?.id === s.id ? 'bg-burgundy/10 border border-burgundy/20' : 'bg-white border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.totalHours}/{s.requiredHours} ч</div>
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
                      <p className="text-xs text-gray-400 mt-0.5">{selectedStudent.totalHours} из {selectedStudent.requiredHours} часов</p>
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
                          <input type="text" placeholder="напр. 26 мая" value={newEntry.date}
                            onChange={e => setNewEntry(n => ({ ...n, date: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy/30" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Часов</label>
                          <select value={newEntry.hours} onChange={e => setNewEntry(n => ({ ...n, hours: +e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-burgundy/30">
                            {[1,2,3,4].map(h => <option key={h} value={h}>{h} ч</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Оценка</label>
                          <select value={newEntry.grade} onChange={e => setNewEntry(n => ({ ...n, grade: +e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-burgundy/30">
                            {[3,4,5].map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">Комментарий</label>
                          <input type="text" placeholder="Краткая заметка" value={newEntry.comment}
                            onChange={e => setNewEntry(n => ({ ...n, comment: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy/30" />
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
                      {selectedStudent.journal.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-xs">Записей нет</td></tr>
                      )}
                      {selectedStudent.journal.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50/50">
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
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${tab === t.id ? 'bg-burgundy/10 text-burgundy font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
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
              <button key={t.id} onClick={() => { setTab(t.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-sm ${tab === t.id ? 'bg-burgundy/10 text-burgundy font-medium' : 'text-gray-600'}`}>
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
          <h1 className="font-montserrat font-bold text-xl text-gray-900">{TABS.find(t => t.id === tab)?.label}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Добро пожаловать, {user.name}</p>
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
