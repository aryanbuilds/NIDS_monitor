from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta, timezone
import os

app = Flask(__name__, static_folder='../frontend/build')
CORS(app)

DB_FILE = 'suricata_alerts.db'

def get_db():
    db = sqlite3.connect(DB_FILE)
    db.row_factory = sqlite3.Row
    return db

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/alerts')
def get_alerts():
    db = get_db()
    start_time = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
    alerts = db.execute(
        'SELECT * FROM alerts WHERE timestamp > ? ORDER BY timestamp DESC LIMIT 100',
        (start_time,)
    ).fetchall()
    return jsonify([dict(alert) for alert in alerts])

@app.route('/api/traffic')
def get_traffic():
    db = get_db()
    start_time = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    traffic = db.execute(
        '''SELECT strftime('%Y-%m-%d %H:%M', timestamp) as time, 
           COUNT(*) as count FROM alerts 
           WHERE timestamp > ? 
           GROUP BY strftime('%Y-%m-%d %H:%M', timestamp)
           ORDER BY time''',
        (start_time,)
    ).fetchall()
    return jsonify([dict(t) for t in traffic])

@app.route('/api/stats')
def get_stats():
    db = get_db()
    start_time = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
    stats = db.execute(
        '''SELECT alert_category, COUNT(*) as count 
           FROM alerts 
           WHERE timestamp > ? 
           GROUP BY alert_category''',
        (start_time,)
    ).fetchall()
    return jsonify(dict(stats))

if __name__ == '__main__':
    app.run(debug=True)
