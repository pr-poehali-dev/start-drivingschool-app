import Icon from '@/components/ui/icon';

export default function Contacts() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-burgundy py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-black text-4xl text-white mb-3">Контакты</h1>
          <p className="text-white/70">Мы всегда на связи в рабочее время</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {[
              {
                icon: 'MapPin',
                title: 'Адрес',
                lines: ['г. Владимир', 'ул. Примерная, 10'],
              },
              {
                icon: 'Phone',
                title: 'Телефон',
                lines: ['+7 (999) 123-45-67'],
                href: 'tel:+79991234567',
              },
              {
                icon: 'Mail',
                title: 'Email',
                lines: ['info@start-auto.ru'],
                href: 'mailto:info@start-auto.ru',
              },
              {
                icon: 'Clock',
                title: 'Режим работы',
                lines: ['Пн–Пт: 9:00–18:00', 'Сб–Вс: выходной'],
              },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4 hover-lift">
                <div className="w-12 h-12 bg-burgundy/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon name={c.icon} size={22} className="text-burgundy" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{c.title}</p>
                  {c.lines.map((line, li) => (
                    c.href && li === 0
                      ? <a key={li} href={c.href} className="block font-semibold text-gray-900 hover:text-burgundy transition-colors">{line}</a>
                      : <p key={li} className="font-semibold text-gray-900">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-3">Есть вопросы?</h2>
            <p className="text-gray-500 mb-6">Позвоните нам или оставьте заявку — мы ответим в течение рабочего дня</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+79991234567"
                className="inline-flex items-center justify-center gap-2 bg-burgundy text-white font-semibold px-6 py-3 rounded-xl hover:bg-burgundy-light transition-all"
              >
                <Icon name="Phone" size={16} />
                Позвонить
              </a>
              <a
                href="mailto:info@start-auto.ru"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-burgundy hover:text-burgundy transition-all"
              >
                <Icon name="Mail" size={16} />
                Написать на почту
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
