import React from 'react';

const HamburgerMenu = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 md:hidden"
      aria-label="Toggle sidebar"
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span className={`w-full h-0.5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-full h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-full h-0.5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </div>
    </button>
  );
};

export default HamburgerMenu;
