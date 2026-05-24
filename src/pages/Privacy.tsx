export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-3xl text-gray-900">Политика конфиденциальности</h1>
          <p className="text-gray-500 mt-2">Автошкола «Старт» — г. Владимир</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl prose prose-sm">
        <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="font-montserrat font-semibold text-gray-900 text-lg mb-2">1. Общие положения</h2>
            <p>Настоящая политика конфиденциальности регулирует порядок обработки персональных данных пользователей сайта автошколы «Старт» (далее — Оператор). Используя сайт, вы соглашаетесь с условиями настоящей политики.</p>
          </section>
          <section>
            <h2 className="font-montserrat font-semibold text-gray-900 text-lg mb-2">2. Какие данные мы собираем</h2>
            <p>Мы собираем данные, которые вы добровольно предоставляете при заполнении форм: ФИО, адрес электронной почты, номер телефона, а также комментарии к заявке. Дополнительно могут собираться технические данные (IP-адрес, тип браузера) в аналитических целях.</p>
          </section>
          <section>
            <h2 className="font-montserrat font-semibold text-gray-900 text-lg mb-2">3. Цели обработки данных</h2>
            <p>Ваши данные используются для: обработки заявок на обучение, связи с вами по вопросам обучения, ведения учебного процесса, исполнения договорных обязательств.</p>
          </section>
          <section>
            <h2 className="font-montserrat font-semibold text-gray-900 text-lg mb-2">4. Хранение и защита данных</h2>
            <p>Персональные данные хранятся на защищённых серверах. Мы принимаем технические и организационные меры для защиты данных от несанкционированного доступа, изменения или уничтожения. Данные не передаются третьим лицам без вашего согласия, за исключением случаев, предусмотренных законодательством.</p>
          </section>
          <section>
            <h2 className="font-montserrat font-semibold text-gray-900 text-lg mb-2">5. Ваши права</h2>
            <p>Вы вправе в любой момент запросить уточнение, изменение или удаление ваших персональных данных. Для этого напишите нам на info@start-auto.ru.</p>
          </section>
          <section>
            <h2 className="font-montserrat font-semibold text-gray-900 text-lg mb-2">6. Контакты</h2>
            <p>г. Владимир, ул. Примерная 10 | info@start-auto.ru | +7 (999) 123-45-67</p>
          </section>
        </div>
      </div>
    </div>
  );
}
