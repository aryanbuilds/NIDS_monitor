import React from 'react';

function LogTable({ logs }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source IP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination IP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.event_type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.src_ip}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.dest_ip}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.proto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogTable;