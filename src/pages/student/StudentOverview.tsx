import Icon from '@/components/ui/icon';

const hoursTotal = 12;
const hoursRequired = 54;

export default function StudentOverview({ userName }: { userName: string }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: 'Clock', label: 'Часов вождения', val: `${hoursTotal} / ${hoursRequired}`, color: 'text-burgundy' },
          { icon: 'BookOpen', label: 'Тесты ПДД', val: 'Демо-база', color: 'text-blue-600' },
          { icon: 'Calendar', label: 'Ближайшее занятие', val: '27 мая 09:00', color: 'text-green-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
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

      <p className="text-sm text-gray-400">Добро пожаловать, {userName}</p>
    </div>
  );
}
