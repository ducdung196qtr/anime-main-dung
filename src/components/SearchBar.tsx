import React, { useState } from 'react';
import { SearchParams } from '../api/jikanApi';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  placeholder = 'Search anime or manga...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ q: searchTerm.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 ease-in-out hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
          disabled={isLoading}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:hover:bg-indigo-600 dark:disabled:hover:bg-indigo-500 text-sm font-medium shadow-md hover:shadow-lg"
          disabled={isLoading}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
