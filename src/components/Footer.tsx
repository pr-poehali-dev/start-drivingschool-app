import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-burgundy rounded-sm flex items-center justify-center">
                <span className="text-white font-montserrat font-black text-sm">С</span>
              </div>
              <div>
                <span className="font-montserrat font-bold text-white text-lg leading-none block">Старт</span>
                <span className="text-xs text-gray-400 leading-none">автошкола</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Учим водить с нуля. Сдай с первого раза — это наша цель.
            </p>
          </div>

          <div>
            <h4 className="font-montserrat font-semibold text-white text-sm mb-4 uppercase tracking-wider">Разделы</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Тарифы', href: '/tariffs' },
                { label: 'Как мы учим', href: '/how-we-teach' },
                { label: 'Инструкторы', href: '/instructors' },
                { label: 'Отзывы', href: '/reviews' },
                { label: 'Подать заявку', href: '/apply' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-semibold text-white text-sm mb-4 uppercase tracking-wider">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Icon name="MapPin" size={15} className="mt-0.5 text-burgundy shrink-0" />
                <span>г. Владимир, ул. Примерная 10</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Phone" size={15} className="text-burgundy shrink-0" />
                <a href="tel:+79991234567" className="hover:text-white transition-colors">+7 (999) 123-45-67</a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={15} className="text-burgundy shrink-0" />
                <a href="mailto:info@start-auto.ru" className="hover:text-white transition-colors">info@start-auto.ru</a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Clock" size={15} className="text-burgundy shrink-0" />
                <span>Пн–Пт 9:00–18:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-montserrat font-semibold text-white text-sm mb-4 uppercase tracking-wider">Мы в соцсетях</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ВК</span>
              </div>
              <span className="text-gray-400">ВКонтакте</span>
            </div>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-burgundy hover:text-white transition-colors"
              >
                <Icon name="LogIn" size={14} />
                Войти в кабинет
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Автошкола «Старт». Все права защищены.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Политика конфиденциальности</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
