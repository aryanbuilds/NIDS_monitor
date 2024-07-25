from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import sqlite3
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import threading
from queue import Queue

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

DB_PATH = 'suricata_logs.db'
LOG_PATH = '/var/log/suricata/eve.json'  # Update this path as needed

# Queue for passing log data between threads
log_queue = Queue()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class LogHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_position = 0

    def on_modified(self, event):
        if event.src_path == LOG_PATH:
            self.process_new_logs()

    def process_new_logs(self):
        with open(LOG_PATH, 'r') as file:
            file.seek(self.last_position)
            new_logs = file.readlines()
            self.last_position = file.tell()

        for log in new_logs:
            try:
                log_data = json.loads(log)
                log_queue.put(log_data)
            except json.JSONDecodeError:
                print(f"Error parsing JSON: {log}")

def database_worker():
    conn = get_db_connection()
    cursor = conn.cursor()

    while True:
        log_data = log_queue.get()
        try:
            cursor.execute('''
                INSERT INTO fileinfo_logs 
                (timestamp, src_ip, dest_ip, protocol, filename, state, event_type, additional_info)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                log_data.get('timestamp'),
                log_data.get('src_ip'),
                log_data.get('dest_ip'),
                log_data.get('proto'),
                log_data.get('fileinfo', {}).get('filename'),
                log_data.get('fileinfo', {}).get('state'),
                log_data.get('event_type'),
                json.dumps(log_data)  # Store the entire log data as a JSON string for additional info
            ))
            conn.commit()
            socketio.emit('new_log', dict(log_data))
        except sqlite3.Error as e:
            print(f"Database error: {e}")
        finally:
            log_queue.task_done()

@app.route('/api/logs')
def get_logs():
    conn = get_db_connection()
    logs = conn.execute('SELECT * FROM fileinfo_logs ORDER BY timestamp DESC LIMIT 100').fetchall()
    conn.close()
    return jsonify([dict(log) for log in logs])

@app.route('/api/stats')
def get_stats():
    conn = get_db_connection()
    stats = conn.execute('''
        SELECT 
            COUNT(*) as total_logs,
            COUNT(DISTINCT src_ip) as unique_sources,
            COUNT(DISTINCT dest_ip) as unique_destinations,
            COUNT(DISTINCT protocol) as unique_protocols
        FROM fileinfo_logs
    ''').fetchone()
    conn.close()
    return jsonify(dict(stats))

def start_log_watcher():
    event_handler = LogHandler()
    observer = Observer()
    observer.schedule(event_handler, path=LOG_PATH, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == '__main__':
    # Start the log watcher thread
    log_watcher_thread = threading.Thread(target=start_log_watcher)
    log_watcher_thread.start()

    # Start the database worker thread
    db_worker_thread = threading.Thread(target=database_worker)
    db_worker_thread.daemon = True
    db_worker_thread.start()

    # Run the Flask-SocketIO app
    socketio.run(app, debug=True, use_reloader=False, allow_unsafe_werkzeug=True)
