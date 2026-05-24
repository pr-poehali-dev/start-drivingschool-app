import json
import os
import psycopg2

SCHEMA = 't_p4445296_start_drivingschool_'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """API для кабинета ученика: слоты и журнал вождения"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'slots')
    conn = get_conn()
    cur = conn.cursor()

    try:
        # ---- SLOTS ----
        if resource == 'slots':
            if method == 'GET':
                student_id = params.get('student_id')
                if student_id:
                    cur.execute(f'''
                        SELECT s.id, s.slot_date, s.slot_time, s.status, u.name
                        FROM "{SCHEMA}".slots s
                        LEFT JOIN "{SCHEMA}".users u ON s.instructor_id = u.id
                        WHERE s.slot_date >= CURRENT_DATE
                          AND (s.status = 'available' OR s.student_id = %s)
                        ORDER BY s.slot_date, s.slot_time
                    ''', (student_id,))
                else:
                    cur.execute(f'''
                        SELECT s.id, s.slot_date, s.slot_time, s.status, u.name
                        FROM "{SCHEMA}".slots s
                        LEFT JOIN "{SCHEMA}".users u ON s.instructor_id = u.id
                        WHERE s.slot_date >= CURRENT_DATE
                        ORDER BY s.slot_date, s.slot_time
                    ''')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'date': r[1].strftime('%Y-%m-%d'), 'time': r[2],
                     'status': r[3], 'instructor': r[4]}
                    for r in rows
                ]
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

            if method == 'PUT':
                body = json.loads(event.get('body') or '{}')
                slot_id = body.get('slot_id')
                action = body.get('action')
                student_id = body.get('student_id')
                if action == 'book':
                    cur.execute(
                        f"UPDATE \"{SCHEMA}\".slots SET status = 'booked', student_id = %s WHERE id = %s AND status = 'available'",
                        (student_id, slot_id)
                    )
                elif action == 'cancel':
                    cur.execute(
                        f"UPDATE \"{SCHEMA}\".slots SET status = 'available', student_id = NULL WHERE id = %s",
                        (slot_id,)
                    )
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        # ---- JOURNAL ----
        if resource == 'journal':
            if method == 'GET':
                student_id = params.get('student_id')
                cur.execute(f'''
                    SELECT j.id, j.lesson_date, j.hours, j.grade, j.comment, u.name
                    FROM "{SCHEMA}".journal j
                    LEFT JOIN "{SCHEMA}".users u ON j.instructor_id = u.id
                    WHERE j.student_id = %s
                    ORDER BY j.created_at DESC
                ''', (student_id,))
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'date': r[1], 'hours': r[2], 'grade': r[3],
                     'comment': r[4], 'instr': r[5]}
                    for r in rows
                ]
                total = sum(r['hours'] for r in result)
                return {'statusCode': 200, 'headers': headers,
                        'body': json.dumps({'entries': result, 'totalHours': total}, ensure_ascii=False)}

        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Unknown resource'})}

    finally:
        conn.close()
