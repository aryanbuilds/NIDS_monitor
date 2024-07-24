#!/bin/bash

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Suricata Monitor Setup${NC}"

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo -e "${YELLOW}Python3 is not installed. Please install Python3 and try again.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js and try again.${NC}"
    exit 1
fi

# Run database setup script
echo -e "${GREEN}Setting up database...${NC}"
./db_setup.sh

# Backend setup
echo -e "${GREEN}Setting up backend...${NC}"


# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

echo -e "${GREEN}Backend setup complete.${NC}"

# Frontend setup
echo -e "${GREEN}Setting up frontend...${NC}"
cd ../frontend

# Install Node.js dependencies
npm install

echo -e "${GREEN}Frontend setup complete.${NC}"

# Create start script
cd ..
cat << EOF > start.sh
#!/bin/bash
# Start backend

source venv/bin/activate
python app.py &
python log_processor.py &

# Start frontend
cd ../frontend
npm start
EOF


echo -e "${GREEN}Setup complete! To start the application${NC}"
echo -e "${YELLOW}Note: Make sure Suricata is running and logging to /var/log/suricata/eve.json${NC}"