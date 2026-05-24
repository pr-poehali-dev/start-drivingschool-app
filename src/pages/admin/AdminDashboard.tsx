import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getGroups, getApplications, updateApplicationStatus, updateDocument, getUsers, createUser, updateUser, getGroupsList, type UserRecord } from '@/lib/api';

const TABS = [
  { id: 'overview', label: 'Обзор', icon: 'LayoutDashboard' },
  { id: 'users', label: 'Пользователи', icon: 'UserPlus' },
  { id: 'groups', label: 'Группы', icon: 'Users' },
  { id: 'applications', label: 'Заявки', icon: 'FileText' },
  { id: 'documents', label: 'Документы', icon: 'FolderOpen' },
];

type Application = {
  id: number; name: string; phone: string; email: string;
  category: string; date: string; status: 'new' | 'contacted' | 'enrolled' | 'rejected';
};

type StudentDoc = { id: number; name: string; phone: string; docs: Record<string, boolean>; totalHours: number; requiredHours: number };
type Group = { id: number; name: string; category: string; instructor: string; start: string; students: StudentDoc[] };

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  new:       { label: 'Новая',    cls: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Связались',cls: 'bg-yellow-100 text-yellow-700' },
  enrolled:  { label: 'Зачислен', cls: 'bg-green-100 text-green-700' },
  rejected:  { label: 'Отказ',    cls: 'bg-red-100 text-red-700' },
};

const DOC_LABELS = ['Паспорт', 'Фото', 'Медсправка', 'Договор'];
const DOC_KEYS = ['passport', 'photo', 'medical', 'contract'] as const;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [groupsList, setGroupsList] = useState<{ id: number; name: string; category: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New user form
  const emptyForm = { login: '', password: '', name: '', phone: '', email: '', account_type: 'student', group_id: '' };
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Edit user
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('start_user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
    Promise.all([
      getGroups().then(setGroups),
      getApplications().then(data => setApps(data as Application[])),
      getUsers().then(setUsers),
      getGroupsList().then(setGroupsList),
    ]).finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => { localStorage.removeItem('start_user'); navigate('/'); };

  const handleAppStatus = async (id: number, status: string) => {
    await updateApplicationStatus(id, status);
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: status as Application['status'] } : a));
  };

  const handleToggleDoc = async (group: Group, studentId: number, doc: string, current: boolean) => {
    await updateDocument(studentId, doc, !current);
    const updateGroup = (g: Group): Group => g.id === group.id
      ? { ...g, students: g.students.map(s => s.id === studentId ? { ...s, docs: { ...s.docs, [doc]: !current } } : s) }
      : g;
    setGroups(prev => prev.map(updateGroup));
    if (selectedGroup?.id === group.id) setSelectedGroup(prev => prev ? updateGroup(prev) : null);
  };

  const handleCreateUser = async () => {
    setFormError('');
    if (!form.login || !form.password || !form.name) {
      setFormError('Заполните имя, логин и пароль');
      return;
    }
    setFormLoading(true);
    try {
      const res = await createUser({
        ...form,
        group_id: form.group_id ? Number(form.group_id) : null,
      });
      if ('error' in res) { setFormError(res.error); return; }
      await getUsers().then(setUsers);
      setForm(emptyForm);
      setShowForm(false);
    } finally {
      setFormLoading(false);
    }
  };

  const openEdit = (u: UserRecord) => {
    setEditUser(u);
    setEditForm({ name: u.name, phone: u.phone, email: u.email, password: '' });
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      await updateUser({ id: editUser.id, ...editForm });
      await getUsers().then(setUsers);
      setEditUser(null);
    } finally {
      setEditLoading(false);
    }
  };

  if (!user) return null;

  const allStudents = groups.flatMap(g => g.students);
  const docsComplete = allStudents.filter(s => Object.values(s.docs).every(Boolean)).length;
  const newApps = apps.filter(a => a.status === 'new').length;

  const renderTab = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-32 text-gray-400">
        <Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...
      </div>
    );

    switch (tab) {
      case 'users':
        return (
          <div className="space-y-5 max-w-4xl">
            {/* Кнопка добавить */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{users.length} пользователей в системе</p>
              <button
                onClick={() => { setShowForm(true); setFormError(''); }}
                className="flex items-center gap-2 bg-burgundy text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-burgundy-light transition-all"
              >
                <Icon name="UserPlus" size={15} />
                Добавить пользователя
              </button>
            </div>

            {/* Форма создания */}
            {showForm && (
              <div className="bg-white rounded-2xl border-2 border-burgundy/20 p-6">
                <h3 className="font-montserrat font-semibold text-gray-900 mb-4">Новый пользователь</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Полное имя *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Иван Иванов" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Тип аккаунта</label>
                    <select value={form.account_type} onChange={e => setForm(f => ({ ...f, account_type: e.target.value }))}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30">
                      <option value="student">Ученик</option>
                      <option value="instructor">Инструктор</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Логин *</label>
                    <input value={form.login} onChange={e => setForm(f => ({ ...f, login: e.target.value }))}
                      placeholder="ivanov" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Пароль *</label>
                    <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Минимум 4 символа" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Телефон</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+7-900-000-00-00" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Email</label>
                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="ivan@mail.ru" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
                  </div>
                  {form.account_type === 'student' && (
                    <div className="sm:col-span-2">
                      <label className="text-xs text-gray-500 block mb-1">Группа</label>
                      <select value={form.group_id} onChange={e => setForm(f => ({ ...f, group_id: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/30">
                        <option value="">— Без группы —</option>
                        {groupsList.map(g => <option key={g.id} value={g.id}>{g.name} (кат. {g.category})</option>)}
                      </select>
                    </div>
                  )}
                </div>
                {formError && (
                  <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                    <Icon name="AlertCircle" size={14} />
                    {formError}
                  </div>
                )}
                <div className="flex gap-3 mt-5">
                  <button onClick={handleCreateUser} disabled={formLoading}
                    className="flex items-center gap-2 bg-burgundy text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-burgundy-light transition-all disabled:opacity-60">
                    {formLoading ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Check" size={14} />}
                    Создать
                  </button>
                  <button onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }}
                    className="text-sm text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Список пользователей */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase">Имя</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase">Логин</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase">Тип</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase">Телефон</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase">Группа</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase">Добавлен</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => {
                    const typeLabel: Record<string, { label: string; cls: string }> = {
                      student:    { label: 'Ученик',         cls: 'bg-blue-100 text-blue-700' },
                      instructor: { label: 'Инструктор',     cls: 'bg-green-100 text-green-700' },
                      admin:      { label: 'Администратор',  cls: 'bg-purple-100 text-purple-700' },
                    };
                    const badge = typeLabel[u.account_type] ?? { label: u.account_type, cls: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">{u.login}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-500">{u.phone || '—'}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{u.group_name || '—'}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{u.created_at}</td>
                        <td className="px-5 py-3">
                          <button onClick={() => openEdit(u)}
                            className="text-xs text-gray-400 hover:text-burgundy transition-colors flex items-center gap-1">
                            <Icon name="Pencil" size={13} />
                            Изменить
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Модалка редактирования */}
            {editUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 w-full max-w-md shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-montserrat font-semibold text-gray-900">Редактировать: {editUser.name}</h3>
                    <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-700">
                      <Icon name="X" size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Полное имя</label>
                      <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Телефон</label>
                      <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Email</label>
                      <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Новый пароль <span className="text-gray-400">(оставьте пустым, если не менять)</span></label>
                      <input type="password" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                        placeholder="Новый пароль" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-burgundy/30" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={handleUpdateUser} disabled={editLoading}
                      className="flex items-center gap-2 bg-burgundy text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-burgundy-light transition-all disabled:opacity-60">
                      {editLoading ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Check" size={14} />}
                      Сохранить
                    </button>
                    <button onClick={() => setEditUser(null)} className="text-sm text-gray-500 px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

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
                      <button onClick={() => handleAppStatus(a.id, 'contacted')}
                        className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-200 transition-all">
                        Связаться
                      </button>
                    </div>
                  ))}
                  {!apps.some(a => a.status === 'new') && <p className="text-sm text-gray-400">Новых заявок нет</p>}
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
                <button key={g.id} onClick={() => setSelectedGroup(g)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all ${selectedGroup?.id === g.id ? 'bg-burgundy/10 border border-burgundy/20' : 'bg-white border border-gray-100 hover:border-gray-200'}`}>
                  <div className="font-medium text-sm text-gray-900">{g.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{g.instructor}</div>
                  <div className="text-xs text-gray-400">{g.students.length} учеников · {g.start}</div>
                </button>
              ))}
            </div>
            <div className="flex-1">
              {!selectedGroup ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm text-center">
                  <div><Icon name="Users" size={32} className="mx-auto mb-2 text-gray-200" />Выберите группу</div>
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
                          {DOC_LABELS.map(d => <th key={d} className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase">{d}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedGroup.students.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-3">
                              <div className="font-medium text-gray-900">{s.name}</div>
                              <div className="text-xs text-gray-400">{s.phone}</div>
                            </td>
                            <td className="px-6 py-3">
                              <div className="text-gray-700">{s.totalHours} ч</div>
                              <div className="h-1 w-16 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-burgundy rounded-full" style={{ width: `${(s.totalHours / s.requiredHours) * 100}%` }} />
                              </div>
                            </td>
                            {DOC_KEYS.map(dk => (
                              <td key={dk} className="px-3 py-3 text-center">
                                <button onClick={() => handleToggleDoc(selectedGroup, s.id, dk, s.docs[dk])}>
                                  <Icon name={s.docs[dk] ? 'CheckCircle' : 'Circle'} size={18} className={s.docs[dk] ? 'text-green-500' : 'text-gray-200'} />
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
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
                      <td className="px-6 py-3"><div className="text-gray-600">{a.phone}</div><div className="text-xs text-gray-400">{a.email}</div></td>
                      <td className="px-6 py-3"><span className="bg-burgundy/10 text-burgundy text-xs px-2 py-0.5 rounded-full">Кат. {a.category}</span></td>
                      <td className="px-6 py-3 text-gray-500 text-xs">{a.date}</td>
                      <td className="px-6 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[a.status]?.cls}`}>
                          {STATUS_LABELS[a.status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <select value={a.status} onChange={e => handleAppStatus(a.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-burgundy/30">
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
                        {DOC_LABELS.map(d => <th key={d} className="px-3 py-2 text-center text-xs font-medium text-gray-400">{d}</th>)}
                        <th className="px-5 py-2 text-center text-xs font-medium text-gray-400">Готовность</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {g.students.map(s => {
                        const complete = Object.values(s.docs).every(Boolean);
                        return (
                          <tr key={s.id} className="hover:bg-gray-50/50">
                            <td className="px-5 py-2.5 font-medium text-gray-900">{s.name}</td>
                            {DOC_KEYS.map(dk => (
                              <td key={dk} className="px-3 py-2.5 text-center">
                                <button onClick={() => handleToggleDoc(g, s.id, dk, s.docs[dk])}>
                                  <Icon name={s.docs[dk] ? 'CheckCircle' : 'XCircle'} size={17}
                                    className={s.docs[dk] ? 'text-green-500' : 'text-red-300'} />
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
        <span className="font-montserrat font-bold text-gray-900 text-sm">Администратор</span>
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