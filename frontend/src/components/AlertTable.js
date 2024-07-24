import React from 'react';

const AlertTable = ({ alerts }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Signature</th>
          <th>Source</th>
          <th>Destination</th>
          <th>Severity</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((alert, index) => (
          <tr key={index}>
            <td>{new Date(alert.timestamp).toLocaleString()}</td>
            <td>{alert.alert_signature}</td>
            <td>{`${alert.src_ip}:${alert.src_port}`}</td>
            <td>{`${alert.dest_ip}:${alert.dest_port}`}</td>
            <td>{alert.alert_severity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AlertTable;