import sqlite3
from flask import g

DATABASE = 'suricata_alerts.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def close_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS alerts
                        (timestamp TEXT, event_type TEXT, src_ip TEXT, dest_ip TEXT, 
                         proto TEXT, src_port INTEGER, dest_port INTEGER, 
                         alert_action TEXT, alert_gid INTEGER, alert_signature_id INTEGER, 
                         alert_rev INTEGER, alert_signature TEXT, alert_category TEXT, 
                         alert_severity INTEGER)''')
        conn.commit()

if __name__ == '__main__':
    init_db()