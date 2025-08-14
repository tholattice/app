"use client";

import { useDarkMode } from '../contexts/DarkModeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <MdLightMode className="w-5 h-5 text-yellow-500" />
      ) : (
        <MdDarkMode className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
