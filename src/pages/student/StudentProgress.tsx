import Icon from '@/components/ui/icon';

const hoursTotal = 12;
const hoursRequired = 54;

const HISTORY = [
  { date: '15 мая', instr: 'Александр Петров', hours: 2, grade: 5 },
  { date: '18 мая', instr: 'Александр Петров', hours: 2, grade: 4 },
  { date: '20 мая', instr: 'Михаил Сидоров', hours: 2, grade: 5 },
  { date: '22 мая', instr: 'Александр Петров', hours: 2, grade: 4 },
  { date: '24 мая', instr: 'Михаил Сидоров', hours: 2, grade: 5 },
  { date: '25 мая', instr: 'Ольга Иванова', hours: 2, grade: 4 },
];

export default function StudentProgress() {
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
            {HISTORY.map((r, i) => (
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
}
