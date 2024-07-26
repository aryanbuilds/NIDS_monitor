import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProtocolChart({ logs }) {
  const chartData = {
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Protocol Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
}

export default ProtocolChart;