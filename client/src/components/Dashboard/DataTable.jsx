import React from 'react';

// Default empty array if no data is passed or data is not an array
const DataTable = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data available</p>;
  }

  // Assuming data is an array of objects with consistent keys
  const columns = Object.keys(data[0]);
  // console.log(data,columns)
  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="py-2 px-4 border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col,idx) => (
              <td key={idx} className="py-2 px-4 border-b">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
