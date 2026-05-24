
INSERT INTO "t_p4445296_start_drivingschool_".users (login, password_hash, name, phone, email, account_type) VALUES
  ('student',    '123', 'Иван Петров',      '+7-900-000-01', 'petrov@mail.ru',      'student'),
  ('instructor', '123', 'Александр Петров', '+7-900-000-10', 'instr1@mail.ru',      'instructor'),
  ('admin',      '123', 'Администратор',    '+7-999-000-00', 'admin@start-auto.ru', 'admin'),
  ('instr2',     '123', 'Михаил Сидоров',   '+7-900-000-11', 'instr2@mail.ru',      'instructor'),
  ('instr3',     '123', 'Ольга Иванова',    '+7-900-000-12', 'instr3@mail.ru',      'instructor'),
  ('student2',   '123', 'Мария Сидорова',   '+7-900-000-02', 'sidorova@mail.ru',    'student'),
  ('student3',   '123', 'Дмитрий Козлов',   '+7-900-000-03', 'kozlov@mail.ru',      'student'),
  ('student4',   '123', 'Анна Кузнецова',   '+7-900-000-04', 'kuznets@mail.ru',     'student'),
  ('student5',   '123', 'Сергей Морозов',   '+7-900-000-05', 'morozov@mail.ru',     'student'),
  ('student6',   '123', 'Алексей Новиков',  '+7-900-000-06', 'novikov@mail.ru',     'student');

INSERT INTO "t_p4445296_start_drivingschool_".groups (name, category, instructor_id, start_date) VALUES
  ('Группа Б-1', 'B', 2, 'Март 2026'),
  ('Группа Б-2', 'B', 4, 'Апрель 2026'),
  ('Группа А-1', 'A', 5, 'Май 2026');

INSERT INTO "t_p4445296_start_drivingschool_".group_students (group_id, student_id) VALUES
  (1, 1), (1, 6), (1, 7),
  (2, 8), (2, 9),
  (3, 10);

INSERT INTO "t_p4445296_start_drivingschool_".student_documents (student_id, passport, photo, medical, contract) VALUES
  (1,  TRUE, TRUE,  TRUE,  TRUE),
  (6,  TRUE, TRUE,  FALSE, TRUE),
  (7,  TRUE, TRUE,  TRUE,  TRUE),
  (8,  TRUE, FALSE, FALSE, TRUE),
  (9,  TRUE, TRUE,  FALSE, FALSE),
  (10, TRUE, TRUE,  TRUE,  TRUE);

INSERT INTO "t_p4445296_start_drivingschool_".slots (instructor_id, slot_date, slot_time, student_id, status) VALUES
  (2, '2026-05-27', '09:00', 1,    'booked'),
  (4, '2026-05-29', '14:00', NULL, 'available'),
  (5, '2026-05-30', '10:00', NULL, 'available'),
  (2, '2026-06-02', '11:00', NULL, 'available'),
  (4, '2026-06-03', '16:00', NULL, 'available'),
  (5, '2026-06-04', '09:00', 1,    'booked');

INSERT INTO "t_p4445296_start_drivingschool_".journal (student_id, instructor_id, lesson_date, hours, grade, comment) VALUES
  (1, 2, '15 мая', 2, 5, 'Уверенное вождение на площадке'),
  (1, 2, '18 мая', 2, 4, 'Трудности с параллельной парковкой'),
  (1, 4, '20 мая', 2, 5, 'Хорошо проехал по городу'),
  (1, 2, '22 мая', 2, 4, 'Сложные манёвры'),
  (1, 4, '24 мая', 2, 5, 'Отличный темп'),
  (1, 5, '25 мая', 2, 4, 'Нужно поработать над разворотами'),
  (6, 2, '16 мая', 2, 3, 'Первый выезд — волнение'),
  (6, 2, '20 мая', 2, 4, 'Лучше держит дистанцию'),
  (6, 2, '23 мая', 2, 4, 'Прогресс очевиден'),
  (7, 2, '14 мая', 2, 5, 'Отличный темп'),
  (7, 2, '17 мая', 2, 5, 'Самостоятельное принятие решений');

INSERT INTO "t_p4445296_start_drivingschool_".applications (name, phone, email, category, status) VALUES
  ('Павел Жуков',        '+7-900-111-22', 'zhukov@mail.ru',   'B', 'new'),
  ('Екатерина Лебедева', '+7-900-222-33', 'lebedeva@mail.ru', 'A', 'contacted'),
  ('Роман Смирнов',      '+7-900-333-44', 'smirnov@mail.ru',  'B', 'enrolled'),
  ('Наталья Фёдорова',   '+7-900-444-55', 'fedorova@mail.ru', 'B', 'new');
