import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { getSlots, bookSlot as apiBook, cancelSlot as apiCancel } from '@/lib/api';

type Slot = { id: number; date: string; time: string; status: string; instructor: string };

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DAYS_RU = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];

export default function StudentCalendar({ userId }: { userId: number }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  useEffect(() => {
    getSlots(userId).then(setSlots).finally(() => setLoading(false));
  }, [userId]);

  const bookSlot = async (slotId: number) => {
    setBusy(slotId);
    try {
      await apiBook(slotId, userId);
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'booked' } : s));
    } finally {
      setBusy(null);
    }
  };

  const cancelSlot = async (slotId: number) => {
    setBusy(slotId);
    try {
      await apiCancel(slotId);
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'available' } : s));
    } finally {
      setBusy(null);
    }
  };

  // Группируем слоты по дате
  const slotsByDate: Record<string, Slot[]> = {};
  slots.forEach(s => {
    if (!slotsByDate[s.date]) slotsByDate[s.date] = [];
    slotsByDate[s.date].push(s);
  });

  // Дни текущего месяца для календаря
  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startOffset = firstDay.getDay(); // 0=вс
  const totalCells = startOffset + lastDay.getDate();
  const weeks = Math.ceil(totalCells / 7);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  };

  const selectedSlots = selectedDate ? (slotsByDate[selectedDate] || []) : [];
  const myBookedSlots = slots.filter(s => s.status === 'booked');

  if (loading) return (
    <div className="flex items-center justify-center h-32 text-gray-400">
      <Icon name="Loader2" size={24} className="animate-spin mr-2" />Загрузка...
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Мои записи */}
      {myBookedSlots.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="CheckCircle" size={15} className="text-green-600" />
            <span className="text-sm font-semibold text-green-800">Мои записи ({myBookedSlots.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {myBookedSlots.map(s => {
              const d = new Date(s.date);
              return (
                <div key={s.id} className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2 text-xs">
                  <div>
                    <span className="font-semibold text-gray-900">
                      {d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-gray-500 ml-1">{s.time}</span>
                    <span className="text-gray-400 ml-1">· {s.instructor}</span>
                  </div>
                  <button
                    onClick={() => cancelSlot(s.id)}
                    disabled={busy === s.id}
                    className="text-red-400 hover:text-red-600 ml-1"
                  >
                    {busy === s.id ? <Icon name="Loader2" size={12} className="animate-spin" /> : <Icon name="X" size={12} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-[auto_1fr] gap-5">
        {/* Календарь */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Шапка месяца */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Icon name="ChevronLeft" size={16} className="text-gray-500" />
            </button>
            <span className="font-montserrat font-bold text-sm text-gray-900">
              {MONTHS_RU[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Icon name="ChevronRight" size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 border-b border-gray-50">
            {DAYS_RU.map(d => (
              <div key={d} className="text-center text-xs text-gray-400 py-2 font-medium">{d}</div>
            ))}
          </div>

          {/* Сетка дней */}
          <div className="p-2">
            {Array.from({ length: weeks }).map((_, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {Array.from({ length: 7 }).map((_, di) => {
                  const cellIdx = wi * 7 + di;
                  const dayNum = cellIdx - startOffset + 1;
                  if (dayNum < 1 || dayNum > lastDay.getDate()) {
                    return <div key={di} className="p-1 h-10" />;
                  }
                  const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const daySlots = slotsByDate[dateStr] || [];
                  const hasAvailable = daySlots.some(s => s.status === 'available');
                  const hasBooked = daySlots.some(s => s.status === 'booked');
                  const isToday = dateStr === today.toISOString().slice(0, 10);
                  const isPast = new Date(dateStr) < new Date(today.toISOString().slice(0, 10));
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={di}
                      onClick={() => daySlots.length > 0 && !isPast ? setSelectedDate(isSelected ? null : dateStr) : undefined}
                      disabled={daySlots.length === 0 || isPast}
                      className={`relative h-10 w-full rounded-xl text-sm font-medium transition-all
                        ${isSelected ? 'bg-burgundy text-white' : ''}
                        ${!isSelected && isToday ? 'ring-2 ring-burgundy/30 text-burgundy font-bold' : ''}
                        ${!isSelected && !isPast && daySlots.length > 0 ? 'hover:bg-gray-100 text-gray-900 cursor-pointer' : ''}
                        ${!isSelected && (isPast || daySlots.length === 0) ? 'text-gray-300 cursor-default' : ''}
                      `}
                    >
                      {dayNum}
                      {daySlots.length > 0 && !isPast && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasBooked && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} />}
                          {hasAvailable && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-burgundy/60'}`} />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Легенда */}
          <div className="px-4 py-3 border-t border-gray-50 flex gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-burgundy/60 inline-block" />Свободно</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Записан</span>
          </div>
        </div>

        {/* Слоты выбранного дня */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-gray-300 gap-2">
              <Icon name="CalendarDays" size={36} />
              <p className="text-sm">Выберите день на календаре</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
                <p className="font-montserrat font-semibold text-gray-900 text-sm">
                  {new Date(selectedDate).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{selectedSlots.length} слотов</p>
              </div>
              <div className="divide-y divide-gray-50">
                {selectedSlots.map(slot => (
                  <div key={slot.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{slot.time}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{slot.instructor}</div>
                    </div>
                    {slot.status === 'booked' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Icon name="CheckCircle" size={11} />Записан
                        </span>
                        <button
                          onClick={() => cancelSlot(slot.id)}
                          disabled={busy === slot.id}
                          className="text-xs text-red-400 hover:text-red-600 hover:underline flex items-center gap-1"
                        >
                          {busy === slot.id ? <Icon name="Loader2" size={12} className="animate-spin" /> : null}
                          Отменить
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => bookSlot(slot.id)}
                        disabled={busy === slot.id}
                        className="text-xs bg-burgundy text-white px-4 py-1.5 rounded-lg hover:bg-burgundy-light transition-all flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {busy === slot.id && <Icon name="Loader2" size={12} className="animate-spin" />}
                        Записаться
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
