#!/bin/bash

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt


# Setup SQLite database
python - << EOL
import sqlite3

conn = sqlite3.connect('suricata_logs.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS fileinfo_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    src_ip TEXT,
    dest_ip TEXT,
    protocol TEXT,
    filename TEXT,
    state TEXT
)
''')

conn.commit()
conn.close()
print("Database setup complete.")
EOL

# Setup frontend
cd ../frontend
npm install

echo "Setup complete. Please ensure Suricata is configured to generate eve.json logs."
echo "Run the backend with: python app.py"
echo "Run the frontend with: npm start"