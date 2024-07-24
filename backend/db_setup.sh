#!/bin/bash

# Exit on any error
set -e

# Database path
DB_PATH="backend/suricata_alerts.db"

echo "Setting up Suricata Monitor Database..."

# Create the database file if it does not exist
if [ ! -f "$DB_PATH" ]; then
    touch "$DB_PATH"
fi

# Run the Python script to initialize the database schema
python3 -c "
import sqlite3

conn = sqlite3.connect('$DB_PATH')
cursor = conn.cursor()

# Create tables if they don't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY,
        timestamp TEXT,
        flow_id TEXT,
        in_iface TEXT,
        event_type TEXT,
        src_ip TEXT,
        src_port INTEGER,
        dest_ip TEXT,
        dest_port INTEGER,
        proto TEXT,
        pkt_src TEXT,
        hostname TEXT,
        url TEXT,
        http_user_agent TEXT,
        http_content_type TEXT,
        http_method TEXT,
        status INTEGER,
        length INTEGER,
        filename TEXT,
        state TEXT,
        stored TEXT,
        size INTEGER,
        tx_id INTEGER
    )
''')

conn.commit()
conn.close()
"

echo "Database setup complete."
