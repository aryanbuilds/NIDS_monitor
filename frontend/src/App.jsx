import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard';
import LogTable from './components/LogTable';
import ProtocolChart from './components/ProtocolChart';
import TimeSeriesChart from './components/TimeSeriesChart';
import AnimatedGraph from './components/AnimatedGraph';

const socket = io('http://localhost:5000');

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Connected to server');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Disconnected from server');
    }

    function onNewLog(newLog) {
      setLogs((prevLogs) => [...prevLogs, newLog].slice(-100));
    }

    function onStatsUpdate(newStats) {
      setStats(newStats);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_log', onNewLog);
    socket.on('stats_update', onStatsUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_log', onNewLog);
      socket.off('stats_update', onStatsUpdate);
    };
  }, []);

  if (!isConnected) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-2xl text-gray-600">Connecting to server...</p>
    </div>;
  }

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

// import React from 'react';

// function App() {
//   return (
//     <div>
//       <h1>Hello, World!</h1>
//     </div>
//   );
// }

// export default App;