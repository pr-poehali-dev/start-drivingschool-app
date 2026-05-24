import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { getStudentJournal } from '@/lib/api';

const hoursRequired = 54;

type Entry = { id: number; date: string; hours: number; grade: number; comment: string; instr: string };

export default function StudentProgress({ userId }: { userId: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentJournal(userId)
      .then(data => { setEntries(data.entries); setTotalHours(data.totalHours); })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center h-32 text-gray-400">
      <Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-montserrat font-semibold text-gray-900 mb-5">Часы вождения</h3>
        <div className="flex items-end gap-4 mb-3">
          <div className="font-montserrat font-black text-5xl text-burgundy">{totalHours}</div>
          <div className="text-gray-400 mb-1">из {hoursRequired} часов</div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-burgundy to-red-400 rounded-full transition-all"
            style={{ width: `${Math.min((totalHours / hoursRequired) * 100, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-400">Осталось {hoursRequired - totalHours} часов до полного курса</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
          <h3 className="font-montserrat font-semibold text-gray-900 text-sm">История занятий</h3>
        </div>
        {entries.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">Занятий пока нет</div>
        ) : (
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
              {entries.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
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
        )}
      </div>
    </div>
  );
}
