# Setup Steps
>[!info] SURICATA REQUIRED TO SETUP FOLLOW ANY ONLINE RESOURCE FOR THIS.
## Set up whole environment:
- give permission to files
```
chmod +x setup_db.sh
chmod +x setup_env.sh
chmod +x main_script.sh

```
- then run main_script.sh
```
./main_script.sh
```
## Start backend:
```
source venv/bin/activate
python app.py
```
## Start frontend:
```
cd frontend
npm install
npm run dev
```
---

# Convert to Daemon Process

## On Linux:
### Create a systemd service file:
```
sudo nano /etc/systemd/system/nids-backend.service
```
### Content:
```
[Unit]
Description=Network Intrusion Detection System Backend
After=network.target

[Service]
User=nids
WorkingDirectory=/path/to/NIDS_DASHBOARD/backend
ExecStart=/path/to/NIDS_DASHBOARD/backend/venv/bin/python /path/to/NIDS_DASHBOARD/backend/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```
### Enable and start the service:
```
sudo systemctl daemon-reload
sudo systemctl start nids-backend
sudo systemctl enable nids-backend
```
## On Windows:
### Install NSSM:
- Download and extract NSSM.
- Add the path to NSSM in your environment variables.

### Create a service using nssm:
```
nssm install nids-backend
```
### Configure the service:
- Path: C:\path\to\NIDS_DASHBOARD\backend\venv\Scripts\python.exe
- Startup directory: C:\path\to\NIDS_DASHBOARD\backend
- Arguments: C:\path\to\NIDS_DASHBOARD\backend\app.py
  
### Start the service:
```
nssm start nids-backend
```
-[X]This setup should ensure your project is properly structured and ready for deployment. 


## Commands to remeber for suricata 
 - to test the configuration file on network <interface> in my case it;s 'eth0'
 - to check yours use ```ifconfig``` in terminal(linux).

```
sudo suricata -c /etc/suricata/suricata.yaml -i <interface> -v  
```
- to check the suricata working 
```
curl http://testmynids.org/uid/index.html  
```
- now run the command to check logs in realtime and you can change the event type(my case - filetype) by your choice.
```
sudo tail -f eve.json | jq 'select(.event_type=="fileinfo")'
```
![suricata_test.png](/suricata_test.png)
