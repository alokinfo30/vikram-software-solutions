import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ links, color = 'blue', onLogout }) => {
  const location = useLocation();
  
  // Get color classes based on color prop - using conditional rendering
  const getBgClass = () => {
    if (color === 'indigo') return 'bg-indigo-800';
    if (color === 'green') return 'bg-green-800';
    return 'bg-blue-800';
  };
  
  const getHoverClass = () => {
    if (color === 'indigo') return 'hover:bg-indigo-700';
    if (color === 'green') return 'hover:bg-green-700';
    return 'hover:bg-blue-700';
  };
  
  const getActiveClass = () => {
    if (color === 'indigo') return 'bg-indigo-700';
    if (color === 'green') return 'bg-green-700';
    return 'bg-blue-700';
  };
  
  const getColorName = () => {
    if (color === 'indigo') return 'Indigo';
    if (color === 'green') return 'Green';
    return 'Blue';
  };

  return (
    <div className={`w-64 ${getBgClass()} text-white flex flex-col justify-between`}>
      <div>
        <div className="p-4">
          <h2 className="text-2xl font-bold">Vikram Software</h2>
          <p className="text-sm opacity-75">{getColorName()} Portal</p>
        </div>
        <nav className="mt-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 ${location.pathname === link.to || location.pathname.startsWith(link.to + '/') ? getActiveClass() : getHoverClass()}`}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {onLogout && (
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 mt-4 transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Sidebar;