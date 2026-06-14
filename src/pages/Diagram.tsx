import { useState } from 'react';
import Icon from '@/components/ui/icon';

type NodeGroup = {
  id: string;
  label: string;
  color: string;
  textColor: string;
  borderColor: string;
  children?: { id: string; label: string; path?: string; tabs?: string[] }[];
};

const groups: NodeGroup[] = [
  {
    id: 'providers',
    label: 'Провайдеры (App.tsx)',
    color: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    children: [
      { id: 'query', label: 'QueryClientProvider' },
      { id: 'tooltip', label: 'TooltipProvider' },
      { id: 'toaster', label: 'Toaster / Sonner' },
      { id: 'router', label: 'BrowserRouter' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    color: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    children: [
      { id: 'navbar', label: 'Navbar', path: '(публичные страницы)' },
      { id: 'footer', label: 'Footer', path: '(публичные страницы)' },
    ],
  },
  {
    id: 'public',
    label: 'Публичные страницы',
    color: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    children: [
      { id: 'home', label: 'Home', path: '/' },
      { id: 'tariffs', label: 'Tariffs', path: '/tariffs' },
      { id: 'howweteach', label: 'HowWeTeach', path: '/how-we-teach' },
      { id: 'instructors', label: 'Instructors', path: '/instructors' },
      { id: 'reviews', label: 'Reviews', path: '/reviews' },
      { id: 'contacts', label: 'Contacts', path: '/contacts' },
      { id: 'apply', label: 'Apply', path: '/apply' },
      { id: 'login', label: 'Login', path: '/login' },
      { id: 'privacy', label: 'Privacy', path: '/privacy' },
      { id: 'terms', label: 'Terms', path: '/terms' },
      { id: 'notfound', label: 'NotFound', path: '*' },
    ],
  },
  {
    id: 'student',
    label: 'Кабинет ученика',
    color: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    children: [
      {
        id: 'studentdash',
        label: 'StudentDashboard',
        path: '/student/*',
        tabs: [
          'StudentOverview — обзор',
          'StudentPDD — тесты ПДД',
          'StudentCalendar — запись',
          'StudentProgress — прогресс',
          'StudentReview — отзыв',
        ],
      },
    ],
  },
  {
    id: 'instructor',
    label: 'Кабинет инструктора',
    color: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200',
    children: [
      {
        id: 'instrdash',
        label: 'InstructorDashboard',
        path: '/instructor/*',
        tabs: ['Расписание — слоты по дням', 'Журнал — записи занятий'],
      },
    ],
  },
  {
    id: 'admin',
    label: 'Кабинет администратора',
    color: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    children: [
      {
        id: 'admindash',
        label: 'AdminDashboard',
        path: '/admin/*',
        tabs: [
          'Обзор — сводные счётчики',
          'Пользователи — CRUD',
          'Группы — управление',
          'Заявки — воронка статусов',
          'Документы — чеклист',
        ],
      },
    ],
  },
  {
    id: 'ui',
    label: 'UI компоненты (shadcn/ui)',
    color: 'bg-purple-50',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    children: [
      { id: 'icon', label: 'Icon (lucide-react)' },
      { id: 'button', label: 'Button' },
      { id: 'input', label: 'Input / Textarea / Select' },
      { id: 'dialog', label: 'Dialog / Sheet / Drawer' },
      { id: 'tabs', label: 'Tabs / Badge / Progress' },
      { id: 'etc', label: '+ 44 других компонента' },
    ],
  },
  {
    id: 'api',
    label: 'API слой (src/lib/api.ts)',
    color: 'bg-orange-50',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    children: [
      { id: 'auth', label: 'login() → /auth' },
      { id: 'studentapi', label: 'getSlots / bookSlot / cancelSlot / getStudentJournal → /student-api' },
      { id: 'adminapi', label: 'getGroups / getApplications / getUsers / getInstructorStudents / ... → /admin-api' },
      { id: 'reviews_api', label: 'getReviews / postReview → /reviews' },
    ],
  },
];

const arrows = [
  { from: 'providers', to: 'layout', label: 'обёртывает' },
  { from: 'layout', to: 'public', label: 'Navbar + Footer' },
  { from: 'layout', to: 'student', label: 'без Navbar/Footer' },
  { from: 'layout', to: 'instructor', label: 'без Navbar/Footer' },
  { from: 'layout', to: 'admin', label: 'без Navbar/Footer' },
  { from: 'public', to: 'ui', label: 'используют' },
  { from: 'student', to: 'ui', label: 'используют' },
  { from: 'instructor', to: 'ui', label: 'используют' },
  { from: 'admin', to: 'ui', label: 'используют' },
  { from: 'student', to: 'api', label: 'HTTP запросы' },
  { from: 'instructor', to: 'api', label: 'HTTP запросы' },
  { from: 'admin', to: 'api', label: 'HTTP запросы' },
  { from: 'public', to: 'api', label: 'HTTP запросы' },
];

const colorMap: Record<string, string> = {
  providers: 'bg-slate-200 text-slate-800',
  layout: 'bg-gray-200 text-gray-800',
  public: 'bg-blue-200 text-blue-900',
  student: 'bg-green-200 text-green-900',
  instructor: 'bg-amber-200 text-amber-900',
  admin: 'bg-red-200 text-red-900',
  ui: 'bg-purple-200 text-purple-900',
  api: 'bg-orange-200 text-orange-900',
};

export default function Diagram() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [activeArrows, setActiveArrows] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const relatedArrows = activeArrows
    ? arrows.filter(a => a.from === activeArrows || a.to === activeArrows)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-100 py-14 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-gray-900 mb-3">Диаграмма компонентов</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Архитектура фронтенда — кликни на блок, чтобы раскрыть детали и увидеть связи</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveArrows(activeArrows === g.id ? null : g.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeArrows === g.id
                  ? colorMap[g.id] + ' ring-2 ring-offset-1 ring-current'
                  : colorMap[g.id] + ' opacity-70 hover:opacity-100'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Arrows panel */}
        {activeArrows && relatedArrows.length > 0 && (
          <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Связи выбранного блока</p>
            <div className="flex flex-wrap gap-3">
              {relatedArrows.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[a.from]}`}>{groups.find(g => g.id === a.from)?.label}</span>
                  <Icon name="ArrowRight" size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-400 text-xs italic">{a.label}</span>
                  <Icon name="ArrowRight" size={14} className="text-gray-400 shrink-0" />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[a.to]}`}>{groups.find(g => g.id === a.to)?.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main diagram grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map(g => {
            const isActive = activeArrows === g.id;
            const isRelated = relatedArrows.some(a => a.from === g.id || a.to === g.id);
            const dimmed = activeArrows && !isActive && !isRelated;

            return (
              <div
                key={g.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${g.borderColor} ${
                  isActive ? 'shadow-lg scale-[1.01]' : ''
                } ${dimmed ? 'opacity-40' : ''}`}
              >
                {/* Header */}
                <button
                  onClick={() => { toggle(g.id); setActiveArrows(activeArrows === g.id ? null : g.id); }}
                  className={`w-full flex items-center justify-between px-5 py-4 ${g.color} ${g.textColor} font-montserrat font-bold text-sm text-left`}
                >
                  <span>{g.label}</span>
                  <Icon name={expanded[g.id] ? 'ChevronUp' : 'ChevronDown'} size={16} className="shrink-0 ml-2" />
                </button>

                {/* Children */}
                <div className="bg-white divide-y divide-gray-50">
                  {(expanded[g.id] ? g.children : g.children?.slice(0, 3))?.map(c => (
                    <div key={c.id} className="px-5 py-3">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${g.color.replace('bg-', 'bg-').replace('-50', '-400').replace('-100', '-400')}`} />
                        <div>
                          <span className="text-sm font-semibold text-gray-800">{c.label}</span>
                          {c.path && (
                            <span className="ml-2 text-xs text-gray-400 font-mono">{c.path}</span>
                          )}
                          {c.tabs && (
                            <ul className="mt-1.5 space-y-1">
                              {c.tabs.map((t, ti) => (
                                <li key={ti} className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Icon name="CornerDownRight" size={11} className="text-gray-300 shrink-0" />
                                  {t}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!expanded[g.id] && g.children && g.children.length > 3 && (
                    <button
                      onClick={() => toggle(g.id)}
                      className="w-full px-5 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors text-left"
                    >
                      + ещё {g.children.length - 3} компонента
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow diagram */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-montserrat font-bold text-lg text-gray-900 mb-6">Поток данных</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-center">
            {[
              { label: 'Браузер', icon: 'Monitor', color: 'bg-gray-100 text-gray-700' },
              { label: 'App.tsx\nLayout / Router', icon: 'GitBranch', color: 'bg-slate-100 text-slate-700' },
              { label: 'Страница / Dashboard', icon: 'Layout', color: 'bg-blue-50 text-blue-800' },
              { label: 'UI компоненты', icon: 'Layers', color: 'bg-purple-50 text-purple-800' },
              { label: 'api.ts\nHTTP fetch', icon: 'Zap', color: 'bg-orange-50 text-orange-800' },
              { label: 'Cloud Functions\n(Backend)', icon: 'Server', color: 'bg-red-50 text-red-800' },
            ].map((n, i, arr) => (
              <div key={i} className="flex items-center gap-3 flex-1">
                <div className={`rounded-xl px-4 py-3 font-semibold text-xs whitespace-pre-line leading-snug w-full ${n.color} border border-current/10`}>
                  <Icon name={n.icon} size={18} className="mx-auto mb-1" />
                  {n.label}
                </div>
                {i < arr.length - 1 && (
                  <Icon name="ArrowRight" size={16} className="text-gray-300 shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: '11', label: 'публичных страниц', icon: 'Globe' },
            { val: '6', label: 'компонентов кабинетов', icon: 'Layout' },
            { val: '49', label: 'UI компонентов', icon: 'Layers' },
            { val: '4', label: 'backend API эндпоинта', icon: 'Server' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <Icon name={s.icon} size={20} className="text-gray-400 mx-auto mb-2" />
              <div className="font-montserrat font-black text-3xl text-gray-900">{s.val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
