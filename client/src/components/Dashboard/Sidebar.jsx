import React from 'react';

const Sidebar = () => {
  return (
    <div className="h-scree bg-[#14a800] text-white w-64">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>
      <nav>
        <ul>
          <li className="p-4 hover:bg-[#294d24] hover:text-white">
            <a href="/dashboard">Dashboard</a>
          </li>
          {/* <li className="p-4 hover:bg-[#294d24] hover:text-white">
            <a href="/users">Users</a>
          </li>
          <li className="p-4 hover:bg-[#294d24] hover:text-white">
            <a href="/settings">Settings</a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
