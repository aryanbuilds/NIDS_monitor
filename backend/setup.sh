#!/bin/bash

# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup SQLite database
python - << EOL
import sqlite3

conn = sqlite3.connect('suricata_logs.db')
cursor = conn.cursor()

# Create or update the table schema to include additional columns
cursor.execute('''
CREATE TABLE IF NOT EXISTS fileinfo_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    src_ip TEXT,
    dest_ip TEXT,
    protocol TEXT,
    filename TEXT,
    state TEXT,
    event_type TEXT,
    additional_info TEXT
)
''')

# Alter table to add new columns if they don't exist
cursor.execute("PRAGMA table_info(fileinfo_logs)")
columns = [col[1] for col in cursor.fetchall()]
if 'event_type' not in columns:
    cursor.execute('ALTER TABLE fileinfo_logs ADD COLUMN event_type TEXT')
if 'additional_info' not in columns:
    cursor.execute('ALTER TABLE fileinfo_logs ADD COLUMN additional_info TEXT')

conn.commit()
conn.close()
print("Database setup complete.")
EOL

# Setup frontend
cd ../frontend
npm install --legacy-peer-deps

echo "Setup complete. Please ensure Suricata is configured to generate eve.json logs."
echo "Run the backend with: python app.py"
echo "Run the frontend with: npm run dev"
