import React from 'react';
import { Pie } from 'react-chartjs-2';

const AlertStats = ({ stats }) => {
  const chartData = {
    labels: Object.keys(stats),
    datasets: [
      {
        data: Object.values(stats),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <h3>Alert Categories</h3>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AlertStats;