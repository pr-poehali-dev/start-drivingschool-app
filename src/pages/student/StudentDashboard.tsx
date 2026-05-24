import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const TABS = [
  { id: 'overview', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'pdd', label: 'ПДД тесты', icon: 'BookOpen' },
  { id: 'calendar', label: 'Запись', icon: 'Calendar' },
  { id: 'progress', label: 'Прогресс', icon: 'TrendingUp' },
  { id: 'review', label: 'Оставить отзыв', icon: 'Star' },
];

const PDD_QUESTIONS = [
  {
    id: 1,
    q: 'На каком расстоянии от края проезжей части разрешена стоянка?',
    answers: ['Не ближе 3 м', 'Не ближе 1 м', 'Не ближе 5 м', 'Без ограничений'],
    correct: 0,
    explain: 'Стоянка разрешается не ближе 3 м от края проезжей части (ПДД п. 12.1)',
  },
  {
    id: 2,
    q: 'Что означает знак «Уступи дорогу»?',
    answers: ['Остановиться перед знаком', 'Уступить дорогу транспортным средствам на пересекаемой дороге', 'Движение запрещено', 'Главная дорога'],
    correct: 1,
    explain: 'Знак 2.4 «Уступи дорогу» означает, что водитель должен уступить дорогу ТС, движущимся по пересекаемой дороге',
  },
  {
    id: 3,
    q: 'С какого возраста разрешено управление мотоциклом категории А?',
    answers: ['16 лет', '18 лет', '21 год', '17 лет'],
    correct: 1,
    explain: 'Управление мотоциклом категории А разрешается с 18 лет',
  },
  {
    id: 4,
    q: 'Что должен сделать водитель при мигающем жёлтом сигнале светофора?',
    answers: ['Остановиться', 'Продолжать движение без ограничений', 'Проехать с повышенным вниманием', 'Уступить дорогу пешеходам'],
    correct: 2,
    explain: 'Мигающий жёлтый сигнал предупреждает о нерегулируемом перекрёстке — нужно проехать с повышенным вниманием',
  },
  {
    id: 5,
    q: 'Какое максимальное содержание алкоголя в выдыхаемом воздухе допускается для водителя?',
    answers: ['0 промилле', '0.16 мг/л', '0.5 промилле', '0.3 мг/л'],
    correct: 1,
    explain: 'Допустимая норма — не более 0.16 мг/л в выдыхаемом воздухе (суммарная погрешность прибора)',
  },
];

const SLOTS = [
  { date: '2026-05-27', time: '09:00', instructor: 'Александр Петров', status: 'booked' },
  { date: '2026-05-29', time: '14:00', instructor: 'Михаил Сидоров', status: 'available' },
  { date: '2026-05-30', time: '10:00', instructor: 'Ольга Иванова', status: 'available' },
  { date: '2026-06-02', time: '11:00', instructor: 'Александр Петров', status: 'available' },
  { date: '2026-06-03', time: '16:00', instructor: 'Михаил Сидоров', status: 'available' },
  { date: '2026-06-04', time: '09:00', instructor: 'Ольга Иванова', status: 'booked' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState<{ name: string } | null>(null);

  const [pddIdx, setPddIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [testDone, setTestDone] = useState(false);

  const [slots, setSlots] = useState(SLOTS);

  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });
  const [reviewSent, setReviewSent] = useState(false);

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

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === PDD_QUESTIONS[pddIdx].correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (pddIdx + 1 >= PDD_QUESTIONS.length) {
      setTestDone(true);
    } else {
      setPddIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetTest = () => {
    setPddIdx(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setTestDone(false);
  };

  const bookSlot = (idx: number) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, status: 'booked' } : s));
  };

  const cancelSlot = (idx: number) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, status: 'available' } : s));
  };

  const hoursTotal = 12;
  const hoursRequired = 54;

  if (!user) return null;

  const renderTab = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: 'Clock', label: 'Часов вождения', val: `${hoursTotal} / ${hoursRequired}`, color: 'text-burgundy' },
                { icon: 'BookOpen', label: 'Тесты ПДД', val: 'Демо-база', color: 'text-blue-600' },
                { icon: 'Calendar', label: 'Ближайшее занятие', val: '27 мая 09:00', color: 'text-green-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center`}>
                    <Icon name={s.icon} size={20} className={s.color} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                    <div className="font-montserrat font-semibold text-gray-900">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-montserrat font-semibold text-gray-900 mb-4">Прогресс обучения</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Часы вождения</span>
                  <span>{hoursTotal} из {hoursRequired}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-burgundy rounded-full transition-all"
                    style={{ width: `${(hoursTotal / hoursRequired) * 100}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: 'Теория', done: true },
                  { label: 'Площадка', done: true },
                  { label: 'Город', done: false },
                  { label: 'Экзамен', done: false },
                ].map((s, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm p-2 rounded-lg ${s.done ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    <Icon name={s.done ? 'CheckCircle' : 'Circle'} size={14} className={s.done ? 'text-green-500' : 'text-gray-300'} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Video" size={16} className="text-blue-600" />
                  <span className="font-semibold text-blue-800 text-sm">Видеоуроки</span>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Скоро</span>
                </div>
                <p className="text-xs text-blue-600">Видеоматериалы по теории и вождению появятся в личном кабинете</p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CreditCard" size={16} className="text-purple-600" />
                  <span className="font-semibold text-purple-800 text-sm">Оплата</span>
                  <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Скоро</span>
                </div>
                <p className="text-xs text-purple-600">Онлайн-оплата будет доступна в ближайшее время</p>
              </div>
            </div>
          </div>
        );

      case 'pdd':
        return (
          <div className="max-w-2xl">
            {testDone ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${score >= 4 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  <Icon name={score >= 4 ? 'Award' : 'AlertCircle'} size={32} className={score >= 4 ? 'text-green-500' : 'text-yellow-500'} />
                </div>
                <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-2">Тест завершён!</h3>
                <p className="text-gray-500 mb-2">Вы ответили правильно</p>
                <div className="font-montserrat font-black text-4xl text-burgundy mb-4">{score} / {PDD_QUESTIONS.length}</div>
                <p className="text-sm text-gray-400 mb-6">{score >= 4 ? 'Отличный результат! Вы хорошо знаете ПДД.' : 'Повторите материал и попробуйте снова.'}</p>
                <button onClick={resetTest} className="bg-burgundy text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-burgundy-light transition-all">
                  Пройти ещё раз
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500">Вопрос {pddIdx + 1} из {PDD_QUESTIONS.length}</span>
                  <div className="flex gap-1">
                    {PDD_QUESTIONS.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < pddIdx ? 'bg-green-400' : i === pddIdx ? 'bg-burgundy' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <h3 className="font-montserrat font-semibold text-gray-900 text-lg mb-5 leading-snug">
                  {PDD_QUESTIONS[pddIdx].q}
                </h3>
                <div className="space-y-2.5 mb-6">
                  {PDD_QUESTIONS[pddIdx].answers.map((ans, i) => {
                    let cls = 'border border-gray-200 text-gray-700 hover:border-burgundy hover:bg-burgundy/5';
                    if (answered) {
                      if (i === PDD_QUESTIONS[pddIdx].correct) cls = 'border-green-400 bg-green-50 text-green-800';
                      else if (i === selected) cls = 'border-red-400 bg-red-50 text-red-800';
                      else cls = 'border-gray-200 text-gray-400';
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${cls}`}
                      >
                        <span className="font-medium mr-2">{['А', 'Б', 'В', 'Г'][i]}.</span>
                        {ans}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mb-4">
                    <Icon name="Info" size={14} className="inline mr-1.5 text-gray-400" />
                    {PDD_QUESTIONS[pddIdx].explain}
                  </div>
                )}
                {answered && (
                  <button onClick={nextQuestion} className="w-full bg-burgundy text-white font-semibold py-3 rounded-xl hover:bg-burgundy-light transition-all">
                    {pddIdx + 1 >= PDD_QUESTIONS.length ? 'Завершить' : 'Следующий вопрос'}
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case 'calendar':
        return (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-montserrat font-semibold text-gray-900">Доступные слоты на вождение</h3>
                <p className="text-xs text-gray-400 mt-0.5">Запись подтверждается автоматически</p>
              </div>
              <div className="divide-y divide-gray-50">
                {slots.map((slot, i) => {
                  const d = new Date(slot.date);
                  const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
                  return (
                    <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="text-center w-12">
                          <div className="text-lg font-montserrat font-bold text-gray-900">{d.getDate()}</div>
                          <div className="text-xs text-gray-400">{d.toLocaleDateString('ru-RU', { month: 'short' })}</div>
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{slot.time} — {slot.instructor}</div>
                          <div className="text-xs text-gray-400">{dayLabel}</div>
                        </div>
                      </div>
                      {slot.status === 'booked' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Icon name="CheckCircle" size={11} />
                            Записан
                          </span>
                          <button
                            onClick={() => cancelSlot(i)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Отменить
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => bookSlot(i)}
                          className="text-xs bg-burgundy text-white px-4 py-1.5 rounded-lg hover:bg-burgundy-light transition-all"
                        >
                          Записаться
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="max-w-2xl space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-montserrat font-semibold text-gray-900 mb-5">Часы вождения</h3>
              <div className="flex items-end gap-4 mb-3">
                <div className="font-montserrat font-black text-5xl text-burgundy">{hoursTotal}</div>
                <div className="text-gray-400 mb-1">из {hoursRequired} часов</div>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-burgundy to-red-400 rounded-full transition-all"
                  style={{ width: `${(hoursTotal / hoursRequired) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">Осталось {hoursRequired - hoursTotal} часов до полного курса</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                <h3 className="font-montserrat font-semibold text-gray-900 text-sm">История занятий</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Инструктор</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Часы</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Оценка</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { date: '15 мая', instr: 'Александр Петров', hours: 2, grade: 5 },
                    { date: '18 мая', instr: 'Александр Петров', hours: 2, grade: 4 },
                    { date: '20 мая', instr: 'Михаил Сидоров', hours: 2, grade: 5 },
                    { date: '22 мая', instr: 'Александр Петров', hours: 2, grade: 4 },
                    { date: '24 мая', instr: 'Михаил Сидоров', hours: 2, grade: 5 },
                    { date: '25 мая', instr: 'Ольга Иванова', hours: 2, grade: 4 },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3 text-gray-600">{r.date}</td>
                      <td className="px-6 py-3 text-gray-600">{r.instr}</td>
                      <td className="px-6 py-3 text-gray-600">{r.hours} ч</td>
                      <td className="px-6 py-3">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <Icon key={si} name="Star" size={13} className={si < r.grade ? 'text-yellow-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'review':
        if (reviewSent) return (
          <div className="max-w-md text-center bg-white rounded-2xl border border-gray-100 p-10">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={28} className="text-green-500" />
            </div>
            <h3 className="font-montserrat font-bold text-xl text-gray-900 mb-2">Спасибо за отзыв!</h3>
            <p className="text-gray-500 text-sm">Ваш отзыв опубликован на странице отзывов</p>
          </div>
        );
        return (
          <div className="max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-montserrat font-semibold text-gray-900 mb-5">Оцените обучение</h3>
              <div className="mb-5">
                <p className="text-sm text-gray-600 mb-2">Ваша оценка</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setReviewForm(f => ({ ...f, rating: r }))}>
                      <Icon
                        name="Star"
                        size={32}
                        className={r <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ваш отзыв</label>
                <textarea
                  rows={4}
                  value={reviewForm.text}
                  onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Расскажите о своём опыте обучения..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                />
              </div>
              <button
                onClick={() => setReviewSent(true)}
                disabled={!reviewForm.text}
                className="w-full bg-burgundy text-white font-semibold py-3 rounded-xl hover:bg-burgundy-light transition-all disabled:opacity-50"
              >
                Отправить отзыв
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
