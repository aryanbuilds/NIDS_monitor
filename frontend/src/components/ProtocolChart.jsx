import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const ProtocolChart = ({ logs }) => {
  const protocolData = {
    labels: ['TCP', 'UDP', 'ICMP', 'Other'],
    datasets: [{
      data: [
        logs.filter(log => log.protocol === 'TCP').length,
        logs.filter(log => log.protocol === 'UDP').length,
        logs.filter(log => log.protocol === 'ICMP').length,
        logs.filter(log => !['TCP', 'UDP', 'ICMP'].includes(log.protocol)).length
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="bg-purple-500 text-white font-bold py-2 px-4 rounded-t-lg">Protocol Distribution</div>
      <div className="p-4">
        <Bar data={protocolData} options={{responsive: true, maintainAspectRatio: false}} />
      </div>
    </div>
  );
};

export default ProtocolChart;