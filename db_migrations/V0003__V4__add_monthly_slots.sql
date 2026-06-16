INSERT INTO "t_p4445296_start_drivingschool_".slots (instructor_id, slot_date, slot_time, status)
SELECT
  instr.instructor_id,
  d.day::date,
  instr.slot_time,
  'available'
FROM
  (SELECT generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day') AS day) d
  CROSS JOIN (
    SELECT 2 AS instructor_id, '09:00' AS slot_time UNION ALL
    SELECT 2, '11:00' UNION ALL
    SELECT 2, '14:00' UNION ALL
    SELECT 2, '16:00' UNION ALL
    SELECT 4, '10:00' UNION ALL
    SELECT 4, '13:00' UNION ALL
    SELECT 4, '15:00' UNION ALL
    SELECT 4, '17:00' UNION ALL
    SELECT 5, '09:00' UNION ALL
    SELECT 5, '12:00' UNION ALL
    SELECT 5, '15:00' UNION ALL
    SELECT 5, '16:00'
  ) instr
WHERE
  EXTRACT(DOW FROM d.day) NOT IN (0, 6)
  AND NOT EXISTS (
    SELECT 1 FROM "t_p4445296_start_drivingschool_".slots s
    WHERE s.instructor_id = instr.instructor_id
      AND s.slot_date = d.day::date
      AND s.slot_time = instr.slot_time
  );
