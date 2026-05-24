import json
import os
import psycopg2

SCHEMA = 't_p4445296_start_drivingschool_'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """API для админки и инструктора: группы, заявки, документы, журнал"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    resource = params.get('resource', 'groups')
    conn = get_conn()
    cur = conn.cursor()

    try:
        # ---- GROUPS ----
        if resource == 'groups':
            cur.execute(f'''
                SELECT g.id, g.name, g.category, g.start_date, u.name as instructor_name, g.instructor_id
                FROM "{SCHEMA}".groups g
                LEFT JOIN "{SCHEMA}".users u ON g.instructor_id = u.id
                ORDER BY g.id
            ''')
            groups_rows = cur.fetchall()

            cur.execute(f'''
                SELECT gs.group_id, u.id, u.name, u.phone,
                       COALESCE(sd.passport, FALSE), COALESCE(sd.photo, FALSE),
                       COALESCE(sd.medical, FALSE), COALESCE(sd.contract, FALSE),
                       COALESCE(SUM(j.hours), 0)
                FROM "{SCHEMA}".group_students gs
                JOIN "{SCHEMA}".users u ON gs.student_id = u.id
                LEFT JOIN "{SCHEMA}".student_documents sd ON u.id = sd.student_id
                LEFT JOIN "{SCHEMA}".journal j ON u.id = j.student_id
                GROUP BY gs.group_id, u.id, u.name, u.phone, sd.passport, sd.photo, sd.medical, sd.contract
                ORDER BY gs.group_id, u.name
            ''')
            students_rows = cur.fetchall()

            students_by_group: dict = {}
            for r in students_rows:
                gid = r[0]
                if gid not in students_by_group:
                    students_by_group[gid] = []
                students_by_group[gid].append({
                    'id': r[1], 'name': r[2], 'phone': r[3],
                    'docs': {'passport': bool(r[4]), 'photo': bool(r[5]),
                             'medical': bool(r[6]), 'contract': bool(r[7])},
                    'totalHours': int(r[8]), 'requiredHours': 54
                })

            result = []
            for g in groups_rows:
                result.append({
                    'id': g[0], 'name': g[1], 'category': g[2], 'start': g[3],
                    'instructor': g[4] or '', 'instructor_id': g[5],
                    'students': students_by_group.get(g[0], [])
                })
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        # ---- APPLICATIONS ----
        if resource == 'applications':
            if method == 'GET':
                cur.execute(f'''
                    SELECT id, name, phone, email, category, comment, status, created_at
                    FROM "{SCHEMA}".applications ORDER BY created_at DESC
                ''')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'name': r[1], 'phone': r[2], 'email': r[3],
                     'category': r[4], 'comment': r[5], 'status': r[6],
                     'date': r[7].strftime('%d.%m.%Y') if r[7] else ''}
                    for r in rows
                ]
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                cur.execute(
                    f'INSERT INTO "{SCHEMA}".applications (name, phone, email, category, comment) VALUES (%s,%s,%s,%s,%s) RETURNING id',
                    (body.get('name'), body.get('phone'), body.get('email'),
                     body.get('category', 'B'), body.get('comment', ''))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id})}

            if method == 'PUT':
                body = json.loads(event.get('body') or '{}')
                cur.execute(
                    f'UPDATE "{SCHEMA}".applications SET status = %s WHERE id = %s',
                    (body.get('status'), body.get('id'))
                )
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        # ---- DOCUMENTS ----
        if resource == 'documents' and method == 'PUT':
            body = json.loads(event.get('body') or '{}')
            doc = body.get('doc')
            allowed = {'passport', 'photo', 'medical', 'contract'}
            if doc not in allowed:
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Invalid doc field'})}
            cur.execute(
                f'UPDATE "{SCHEMA}".student_documents SET {doc} = %s, updated_at = NOW() WHERE student_id = %s',
                (body.get('value'), body.get('student_id'))
            )
            conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        # ---- INSTRUCTOR JOURNAL ----
        if resource == 'instructor-journal':
            instructor_id = params.get('instructor_id')
            if method == 'GET':
                cur.execute(f'''
                    SELECT u.id, u.name,
                           COALESCE(SUM(j.hours), 0),
                           json_agg(json_build_object(
                               'id', j.id, 'date', j.lesson_date,
                               'hours', j.hours, 'grade', j.grade, 'comment', j.comment
                           ) ORDER BY j.created_at DESC) FILTER (WHERE j.id IS NOT NULL)
                    FROM "{SCHEMA}".group_students gs
                    JOIN "{SCHEMA}".groups g ON gs.group_id = g.id
                    JOIN "{SCHEMA}".users u ON gs.student_id = u.id
                    LEFT JOIN "{SCHEMA}".journal j ON u.id = j.student_id AND j.instructor_id = %s
                    WHERE g.instructor_id = %s
                    GROUP BY u.id, u.name
                    ORDER BY u.name
                ''', (instructor_id, instructor_id))
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'name': r[1], 'totalHours': int(r[2]),
                     'requiredHours': 54, 'journal': r[3] or []}
                    for r in rows
                ]
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                cur.execute(
                    f'''INSERT INTO "{SCHEMA}".journal (student_id, instructor_id, lesson_date, hours, grade, comment)
                        VALUES (%s,%s,%s,%s,%s,%s) RETURNING id''',
                    (body['student_id'], body['instructor_id'],
                     body['lesson_date'], body['hours'], body['grade'], body.get('comment', ''))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id})}

        # ---- USERS ----
        if resource == 'users':
            if method == 'GET':
                cur.execute(f'''
                    SELECT u.id, u.login, u.name, u.phone, u.email, u.account_type, u.created_at,
                           g.name as group_name
                    FROM "{SCHEMA}".users u
                    LEFT JOIN "{SCHEMA}".group_students gs ON u.id = gs.student_id
                    LEFT JOIN "{SCHEMA}".groups g ON gs.group_id = g.id
                    ORDER BY u.account_type, u.name
                ''')
                rows = cur.fetchall()
                result = [
                    {'id': r[0], 'login': r[1], 'name': r[2], 'phone': r[3] or '',
                     'email': r[4] or '', 'account_type': r[5],
                     'created_at': r[6].strftime('%d.%m.%Y') if r[6] else '',
                     'group_name': r[7] or ''}
                    for r in rows
                ]
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                login = body.get('login', '').strip()
                password = body.get('password', '').strip()
                name = body.get('name', '').strip()
                account_type = body.get('account_type', 'student')
                phone = body.get('phone', '')
                email = body.get('email', '')
                group_id = body.get('group_id')

                if not login or not password or not name:
                    return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все обязательные поля'})}

                cur.execute(f'SELECT id FROM "{SCHEMA}".users WHERE login = %s', (login,))
                if cur.fetchone():
                    return {'statusCode': 409, 'headers': headers, 'body': json.dumps({'error': 'Такой логин уже существует'})}

                cur.execute(
                    f'INSERT INTO "{SCHEMA}".users (login, password_hash, name, phone, email, account_type) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id',
                    (login, password, name, phone, email, account_type)
                )
                new_id = cur.fetchone()[0]

                if account_type == 'student':
                    cur.execute(
                        f'INSERT INTO "{SCHEMA}".student_documents (student_id) VALUES (%s)',
                        (new_id,)
                    )
                    if group_id:
                        cur.execute(
                            f'INSERT INTO "{SCHEMA}".group_students (group_id, student_id) VALUES (%s, %s)',
                            (group_id, new_id)
                        )

                conn.commit()
                return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id})}

            if method == 'PUT':
                body = json.loads(event.get('body') or '{}')
                user_id = body.get('id')
                name = body.get('name')
                phone = body.get('phone', '')
                email = body.get('email', '')
                new_password = body.get('password', '').strip()

                if new_password:
                    cur.execute(
                        f'UPDATE "{SCHEMA}".users SET name=%s, phone=%s, email=%s, password_hash=%s WHERE id=%s',
                        (name, phone, email, new_password, user_id)
                    )
                else:
                    cur.execute(
                        f'UPDATE "{SCHEMA}".users SET name=%s, phone=%s, email=%s WHERE id=%s',
                        (name, phone, email, user_id)
                    )
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        # ---- GROUPS LIST (for selects) ----
        if resource == 'groups-list':
            cur.execute(f'SELECT id, name, category FROM "{SCHEMA}".groups ORDER BY id')
            rows = cur.fetchall()
            result = [{'id': r[0], 'name': r[1], 'category': r[2]} for r in rows]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        # ---- SCHEDULE (instructor slots) ----
        if resource == 'schedule':
            instructor_id = params.get('instructor_id')
            cur.execute(f'''
                SELECT s.id, s.slot_date, s.slot_time, s.status, u.name
                FROM "{SCHEMA}".slots s
                LEFT JOIN "{SCHEMA}".users u ON s.student_id = u.id
                WHERE s.instructor_id = %s AND s.slot_date >= CURRENT_DATE
                ORDER BY s.slot_date, s.slot_time
            ''', (instructor_id,))
            rows = cur.fetchall()
            result = [
                {'id': r[0], 'date': r[1].strftime('%Y-%m-%d'), 'time': r[2],
                 'status': r[3], 'student': r[4]}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Unknown resource'})}

    finally:
        conn.close()