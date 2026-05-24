import json
import os
import psycopg2

SCHEMA = 't_p4445296_start_drivingschool_'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Авторизация пользователя по логину и паролю"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    login = body.get('login', '').strip()
    password = body.get('password', '').strip()

    if not login or not password:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Укажите логин и пароль'})}

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f'SELECT id, name, account_type FROM "{SCHEMA}".users WHERE login = %s AND password_hash = %s',
        (login, password)
    )
    row = cur.fetchone()
    conn.close()

    if not row:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

    user = {'id': row[0], 'name': row[1], 'role': row[2], 'login': login}
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps(user)}
