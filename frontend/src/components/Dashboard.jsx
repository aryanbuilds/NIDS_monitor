import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import StatCard from './StatCard';
import ProtocolChart from './ProtocolChart';
import TimeSeriesChart from './TimeSeriesChart';
import LogTable from './LogTable';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    total_logs: 0,
    unique_sources: 0,
    unique_destinations: 0,
    unique_protocols: 0
  });
  
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    const fetchInitialData = async () => {
      const logsResponse = await fetch('http://localhost:5000/api/logs');
      const logsData = await logsResponse.json();
      setLogs(logsData);

      const statsResponse = await fetch('http://localhost:5000/api/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
    };

    fetchInitialData();

    socket.on('new_log', (newLog) => {
      setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]);
      setStats(prevStats => ({
        ...prevStats,
        total_logs: prevStats.total_logs + 1,
        unique_sources: new Set([...prevStats.unique_sources, newLog.src_ip]).size,
        unique_destinations: new Set([...prevStats.unique_destinations, newLog.dest_ip]).size,
        unique_protocols: new Set([...prevStats.unique_protocols, newLog.protocol]).size
      }));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Suricata NIDS Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Logs" value={stats.total_logs} color="blue" />
        <StatCard title="Unique Sources" value={stats.unique_sources} color="green" />
        <StatCard title="Unique Destinations" value={stats.unique_destinations} color="yellow" />
        <StatCard title="Unique Protocols" value={stats.unique_protocols} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProtocolChart logs={logs} />
        <TimeSeriesChart logs={logs} />
      </div>

      <LogTable logs={logs} />
    </div>
  );
};

export default Dashboard;