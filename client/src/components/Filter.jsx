// client/src/components/Filter.js
import React, { useState } from 'react';
import { FaFilter, FaChevronDown } from 'react-icons/fa';

const Filter = ({ options, onFilterChange, label = 'Filter' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <FaFilter className="text-gray-500" />
        <span>{label}</span>
        <FaChevronDown className={`text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-10">
          <div className="p-4">
            {options.map((option) => (
              <div key={option.key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {option.label}
                </label>
                {option.type === 'select' && (
                  <select
                    value={selectedFilters[option.key] || ''}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All</option>
                    {option.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {option.type === 'date' && (
                  <input
                    type="date"
                    value={selectedFilters[option.key] || ''}
                    onChange={(e) => handleFilterChange(option.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                )}
                {option.type === 'checkbox' && (
                  <div className="space-y-2">
                    {option.options.map((opt) => (
                      <label key={opt.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters[option.key]?.includes(opt.value) || false}
                          onChange={(e) => {
                            const current = selectedFilters[option.key] || [];
                            const newValue = e.target.checked
                              ? [...current, opt.value]
                              : current.filter(v => v !== opt.value);
                            handleFilterChange(option.key, newValue);
                          }}
                          className="mr-2"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;