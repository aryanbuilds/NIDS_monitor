import React from 'react';
import { Line } from 'react-chartjs-2';

const TrafficChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d.time).toLocaleTimeString()),
    datasets: [
      {
        label: 'Alert Count',
        data: data.map(d => d.count),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TrafficChart;