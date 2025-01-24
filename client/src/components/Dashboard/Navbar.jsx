import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#14a800]">Admin<span className="text-[#437A3C]">Dashboard</span></h1>
      </div>
      <div>
        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded">Logout</button> */}
      </div>
    </div>
  );
};

export default Navbar;
