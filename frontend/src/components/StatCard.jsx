import React from 'react';

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white shadow-lg rounded-lg`}>
    <div className={`bg-${color}-500 text-white font-bold py-2 px-4 rounded-t-lg`}>{title}</div>
    <div className="text-2xl font-bold text-center py-4">{value}</div>
  </div>
);

export default StatCard;