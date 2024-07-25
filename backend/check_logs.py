import sqlite3

DB_PATH = 'suricata_logs.db'

def fetch_logs():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM fileinfo_logs LIMIT 10')
    rows = cursor.fetchall()
    conn.close()
    return rows

logs = fetch_logs()
for log in logs:
    print(log)
