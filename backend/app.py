from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import json
import time
import threading
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from database import create_table, insert_log, get_stats, get_recent_logs

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

LOG_PATH = '/var/log/suricata/eve.json'  # Update this path as needed

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
                insert_log(log_data)
                socketio.emit('new_log', log_data)
            except json.JSONDecodeError:
                print(f"Error parsing JSON: {log}")

        stats = get_stats()
        socketio.emit('stats_update', stats)

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

@app.route('/api/logs')
def api_logs():
    logs = get_recent_logs()
    return jsonify(logs)

@app.route('/api/stats')
def api_stats():
    stats = get_stats()
    return jsonify(stats)

if __name__ == '__main__':
    create_table()

    log_watcher_thread = threading.Thread(target=start_log_watcher)
    log_watcher_thread.daemon = True
    log_watcher_thread.start()

    socketio.run(app, debug=True, use_reloader=False, allow_unsafe_werkzeug=True)