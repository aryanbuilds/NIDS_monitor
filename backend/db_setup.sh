#!/bin/bash

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Suricata Monitor Database${NC}"

# Check if SQLite3 is installed
if ! command -v sqlite3 &> /dev/null
then
    echo -e "${YELLOW}SQLite3 is not installed. Please install SQLite3 and try again.${NC}"
    exit 1
fi

# Create the database and tables
sqlite3 backend/suricata_alerts.db << EOF
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    event_type TEXT,
    src_ip TEXT,
    dest_ip TEXT,
    proto TEXT,
    src_port INTEGER,
    dest_port INTEGER,
    alert_action TEXT,
    alert_gid INTEGER,
    alert_signature_id INTEGER,
    alert_rev INTEGER,
    alert_signature TEXT,
    alert_category TEXT,
    alert_severity INTEGER
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_src_ip ON alerts(src_ip);
CREATE INDEX IF NOT EXISTS idx_dest_ip ON alerts(dest_ip);
CREATE INDEX IF NOT EXISTS idx_alert_category ON alerts(alert_category);
EOF

echo -e "${GREEN}Database setup complete.${NC}"