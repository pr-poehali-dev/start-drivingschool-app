import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { getSlots, bookSlot as apiBook, cancelSlot as apiCancel } from '@/lib/api';

type Slot = { id: number; date: string; time: string; status: string; instructor: string };

export default function StudentCalendar({ userId }: { userId: number }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSlots(userId).then(setSlots).finally(() => setLoading(false));
  }, [userId]);

  const bookSlot = async (slotId: number) => {
    await apiBook(slotId, userId);
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'booked' } : s));
  };

  const cancelSlot = async (slotId: number) => {
    await apiCancel(slotId);
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'available' } : s));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-32 text-gray-400">
      <Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="font-montserrat font-semibold text-gray-900">Доступные слоты на вождение</h3>
          <p className="text-xs text-gray-400 mt-0.5">Запись подтверждается автоматически</p>
        </div>
        <div className="divide-y divide-gray-50">
          {slots.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Нет доступных слотов</div>
          )}
          {slots.map((slot) => {
            const d = new Date(slot.date);
            const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
            return (
              <div key={slot.id} className="px-6 py-4 flex items-center justify-between gap-4">
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
                    <button onClick={() => cancelSlot(slot.id)} className="text-xs text-red-500 hover:underline">
                      Отменить
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => bookSlot(slot.id)}
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
