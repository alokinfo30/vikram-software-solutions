import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ links, color = 'blue', onLogout, isOpen, onToggle }) => {
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
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md ${getBgClass()} text-white shadow-lg`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 ${getBgClass()} text-white 
        flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="p-4 pt-16 lg:pt-4">
            <h2 className="text-xl sm:text-2xl font-bold">Vikram Software</h2>
            <p className="text-sm opacity-75">{getColorName()} Portal</p>
          </div>
          <nav className="mt-4 lg:mt-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => window.innerWidth < 1024 && onToggle()}
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
    </>
  );
};

export default Sidebar;
