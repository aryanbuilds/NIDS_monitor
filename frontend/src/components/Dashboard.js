import React, { useState, useEffect } from 'react';
import AlertTable from './AlertTable';
import TrafficChart from './TrafficChart';
import AlertStats from './AlertStats';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const alertsResponse = await fetch('http://localhost:5000/api/alerts');
      const alertsData = await alertsResponse.json();
      setAlerts(alertsData);

      const trafficResponse = await fetch('http://localhost:5000/api/traffic');
      const trafficData = await trafficResponse.json();
      setTraffic(trafficData);

      const statsResponse = await fetch('http://localhost:5000/api/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col-md-8">
          <TrafficChart data={traffic} />
        </div>
        <div className="col-md-4">
          <AlertStats stats={stats} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <AlertTable alerts={alerts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;