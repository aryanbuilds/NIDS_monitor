import json
import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import sqlite3
from datetime import datetime, timedelta

DB_FILE = 'suricata_alerts.db'

class LogHandler(FileSystemEventHandler):
    def __init__(self, filename):
        self.filename = filename
        self.last_position = 0
        self.conn = sqlite3.connect(DB_FILE)
        self.cursor = self.conn.cursor()
        self.buffer = []
        self.last_commit = datetime.now()

    def on_modified(self, event):
        if event.src_path == self.filename:
            with open(self.filename, 'r') as f:
                f.seek(self.last_position)
                for line in f:
                    self.process_log_line(line.strip())
                self.last_position = f.tell()
            
            if len(self.buffer) >= 100 or (datetime.now() - self.last_commit) > timedelta(seconds=5):
                self.commit_buffer()

    def process_log_line(self, line):
        event = json.loads(line)
        if event.get('event_type') == 'alert':
            self.buffer.append((
                event['timestamp'], event['event_type'], event.get('src_ip', ''),
                event.get('dest_ip', ''), event.get('proto', ''),
                event.get('src_port', 0), event.get('dest_port', 0),
                event['alert'].get('action', ''), event['alert'].get('gid', 0),
                event['alert'].get('signature_id', 0), event['alert'].get('rev', 0),
                event['alert'].get('signature', ''), event['alert'].get('category', ''),
                event['alert'].get('severity', 0)
            ))

    def commit_buffer(self):
        self.cursor.executemany('''INSERT INTO alerts 
                                   (timestamp, event_type, src_ip, dest_ip, proto, src_port, dest_port,
                                    alert_action, alert_gid, alert_signature_id, alert_rev,
                                    alert_signature, alert_category, alert_severity)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', self.buffer)
        self.conn.commit()
        self.buffer = []
        self.last_commit = datetime.now()

def main():
    log_file = '/var/log/suricata/eve.json'  # Update this path if necessary
    
    event_handler = LogHandler(log_file)
    observer = Observer()
    observer.schedule(event_handler, path=os.path.dirname(log_file), recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
    event_handler.conn.close()

if __name__ == '__main__':
    main()