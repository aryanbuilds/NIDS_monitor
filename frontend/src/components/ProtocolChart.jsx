import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const ProtocolChart = ({ logs }) => {
  const [selectedProtocol, setSelectedProtocol] = useState('All');

  const protocols = ['All', 'TCP', 'UDP', 'ICMP', 'HTTP', 'DNS', 'Other'];

  const filteredLogs = selectedProtocol === 'All' 
    ? logs 
    : logs.filter(log => log.proto === selectedProtocol);

  const protocolData = {
    labels: ['TCP', 'UDP', 'ICMP', 'HTTP', 'DNS', 'Other'],
    datasets: [{
      data: [
        filteredLogs.filter(log => log.proto === 'TCP').length,
        filteredLogs.filter(log => log.proto === 'UDP').length,
        filteredLogs.filter(log => log.proto === 'ICMP').length,
        filteredLogs.filter(log => log.proto === 'HTTP').length,
        filteredLogs.filter(log => log.proto === 'DNS').length,
        filteredLogs.filter(log => !['TCP', 'UDP', 'ICMP', 'HTTP', 'DNS'].includes(log.proto)).length
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
    }]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="bg-purple-500 text-white font-bold py-2 px-4 rounded-t-lg flex justify-between">
        <span>Protocol Distribution</span>
        <select 
          className="bg-purple-500 text-white font-bold"
          value={selectedProtocol}
          onChange={(e) => setSelectedProtocol(e.target.value)}
        >
          {protocols.map((protocol, index) => (
            <option key={index} value={protocol}>{protocol}</option>
          ))}
        </select>
      </div>
      <div className="p-4">
        <Bar data={protocolData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default ProtocolChart;
