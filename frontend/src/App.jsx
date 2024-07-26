import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LogTable from './components/LogTable';
import ProtocolChart from './components/ProtocolChart';
import TimeSeriesChart from './components/TimeSeriesChart';
import AnimatedGraph from './components/AnimatedGraph';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    socket.on('new_log', (newLog) => {
      setLogs((prevLogs) => [...prevLogs, newLog].slice(-100));
    });

    socket.on('stats_update', (newStats) => {
      setStats(newStats);
    });

    return () => {
      socket.off('new_log');
      socket.off('stats_update');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Network Intrusion Detection System</h1>
      <Dashboard stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ProtocolChart logs={logs} />
        <TimeSeriesChart logs={logs} />
      </div>
      <LogTable logs={logs} />
      <AnimatedGraph />
    </div>
  );
}

export default App;