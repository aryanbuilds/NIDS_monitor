import sqlite3
import json
from datetime import datetime

DB_PATH = 'suricata_logs.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS suricata_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            event_type TEXT,
            src_ip TEXT,
            src_port INTEGER,
            dest_ip TEXT,
            dest_port INTEGER,
            proto TEXT,
            app_proto TEXT,
            flow_id INTEGER,
            alert_action TEXT,
            alert_gid INTEGER,
            alert_signature_id INTEGER,
            alert_rev INTEGER,
            alert_signature TEXT,
            alert_category TEXT,
            alert_severity INTEGER,
            http_hostname TEXT,
            http_url TEXT,
            http_http_user_agent TEXT,
            http_http_content_type TEXT,
            http_http_method TEXT,
            http_protocol TEXT,
            http_status INTEGER,
            http_length INTEGER,
            tls_subject TEXT,
            tls_issuerdn TEXT,
            tls_fingerprint TEXT,
            ssh_client_software_version TEXT,
            ssh_server_software_version TEXT,
            full_log TEXT
        )
    ''')
    conn.commit()
    conn.close()

def insert_log(log_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO suricata_logs 
        (timestamp, event_type, src_ip, src_port, dest_ip, dest_port, proto, app_proto, flow_id,
         alert_action, alert_gid, alert_signature_id, alert_rev, alert_signature, alert_category, alert_severity,
         http_hostname, http_url, http_http_user_agent, http_http_content_type, http_http_method, http_protocol, http_status, http_length,
         tls_subject, tls_issuerdn, tls_fingerprint,
         ssh_client_software_version, ssh_server_software_version,
         full_log)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        log_data.get('timestamp'),
        log_data.get('event_type'),
        log_data.get('src_ip'),
        log_data.get('src_port'),
        log_data.get('dest_ip'),
        log_data.get('dest_port'),
        log_data.get('proto'),
        log_data.get('app_proto'),
        log_data.get('flow_id'),
        log_data.get('alert', {}).get('action'),
        log_data.get('alert', {}).get('gid'),
        log_data.get('alert', {}).get('signature_id'),
        log_data.get('alert', {}).get('rev'),
        log_data.get('alert', {}).get('signature'),
        log_data.get('alert', {}).get('category'),
        log_data.get('alert', {}).get('severity'),
        log_data.get('http', {}).get('hostname'),
        log_data.get('http', {}).get('url'),
        log_data.get('http', {}).get('http_user_agent'),
        log_data.get('http', {}).get('http_content_type'),
        log_data.get('http', {}).get('http_method'),
        log_data.get('http', {}).get('protocol'),
        log_data.get('http', {}).get('status'),
        log_data.get('http', {}).get('length'),
        log_data.get('tls', {}).get('subject'),
        log_data.get('tls', {}).get('issuerdn'),
        log_data.get('tls', {}).get('fingerprint'),
        log_data.get('ssh', {}).get('client', {}).get('software_version'),
        log_data.get('ssh', {}).get('server', {}).get('software_version'),
        json.dumps(log_data)
    ))
    conn.commit()
    conn.close()

def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT 
            COUNT(*) as total_logs,
            COUNT(DISTINCT event_type) as unique_event_types,
            COUNT(DISTINCT src_ip) as unique_src_ips,
            COUNT(DISTINCT dest_ip) as unique_dest_ips,
            COUNT(DISTINCT proto) as unique_protocols
        FROM suricata_logs
    ''')
    stats = dict(cursor.fetchone())
    conn.close()
    return stats

def get_recent_logs(limit=100):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM suricata_logs ORDER BY timestamp DESC LIMIT ?', (limit,))
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return logs