import json
import os
import psycopg2

SCHEMA = 't_p4445296_start_drivingschool_'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Отзывы: получение всех и добавление"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    conn = get_conn()
    cur = conn.cursor()

    if method == 'GET':
        cur.execute(f'''
            SELECT r.id, r.rating, r.body, r.created_at, u.name
            FROM "{SCHEMA}".reviews r
            JOIN "{SCHEMA}".users u ON r.student_id = u.id
            ORDER BY r.created_at DESC
        ''')
        rows = cur.fetchall()
        conn.close()
        result = [
            {'id': r[0], 'rating': r[1], 'text': r[2],
             'date': r[3].strftime('%d.%m.%Y') if r[3] else '', 'name': r[4]}
            for r in rows
        ]
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        cur.execute(
            f'INSERT INTO "{SCHEMA}".reviews (student_id, rating, body) VALUES (%s, %s, %s) RETURNING id',
            (body['student_id'], body['rating'], body['text'])
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id})}

    conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
