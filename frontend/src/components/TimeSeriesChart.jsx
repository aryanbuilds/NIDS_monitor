import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const TimeSeriesChart = ({ logs }) => {
  const timeSeriesData = {
    labels: logs.map(log => new Date(log.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Log Entries',
      data: logs.map((_, index) => logs.length - index),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div className="bg-white shadow-lg rounded-lg">
      <div className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-t-lg">Log Entries Over Time</div>
      <div className="p-4">
        <Line data={timeSeriesData} options={{responsive: true, maintainAspectRatio: false}} />
      </div>
    </div>
  );
};

export default TimeSeriesChart;