import React from 'react';
import StatCard from './StatCard';

function Dashboard({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard title="Total Logs" value={stats.total_logs || 0} />
      <StatCard title="Unique Event Types" value={stats.unique_event_types || 0} />
      <StatCard title="Unique Source IPs" value={stats.unique_src_ips || 0} />
      <StatCard title="Unique Destination IPs" value={stats.unique_dest_ips || 0} />
      <StatCard title="Unique Protocols" value={stats.unique_protocols || 0} />
    </div>
  );
}

export default Dashboard;