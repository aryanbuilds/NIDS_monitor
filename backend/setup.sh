#!/bin/bash

# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt


# Setup frontend
cd ../frontend
npm install --legacy-peer-deps

echo "Setup complete. Please ensure Suricata is configured to generate eve.json logs."
echo "Run the backend with: python app.py"
echo "Run the frontend with: npm run dev"
