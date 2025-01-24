import React from 'react';

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  );
};

export default StatsCard;
