import { useState } from 'react';
import Icon from '@/components/ui/icon';

const INITIAL_SLOTS = [
  { date: '2026-05-27', time: '09:00', instructor: 'Александр Петров', status: 'booked' },
  { date: '2026-05-29', time: '14:00', instructor: 'Михаил Сидоров', status: 'available' },
  { date: '2026-05-30', time: '10:00', instructor: 'Ольга Иванова', status: 'available' },
  { date: '2026-06-02', time: '11:00', instructor: 'Александр Петров', status: 'available' },
  { date: '2026-06-03', time: '16:00', instructor: 'Михаил Сидоров', status: 'available' },
  { date: '2026-06-04', time: '09:00', instructor: 'Ольга Иванова', status: 'booked' },
];

export default function StudentCalendar() {
  const [slots, setSlots] = useState(INITIAL_SLOTS);

  const bookSlot = (idx: number) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, status: 'booked' } : s));
  };

  const cancelSlot = (idx: number) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, status: 'available' } : s));
  };

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
}
