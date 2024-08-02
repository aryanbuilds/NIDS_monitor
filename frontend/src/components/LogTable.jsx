import React from 'react';

const LogTable = ({ logs }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-gray-700">Recent Logs</h2>
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination IP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.slice(0, 10).map((log, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.src_ip}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.dest_ip}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.proto}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.event_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LogTable;
