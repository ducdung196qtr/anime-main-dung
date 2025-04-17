import React from 'react';
import SearchBar from './SearchBar';
import Filters from './Filters';
import { SearchParams } from '../api/jikanApi';

interface SidebarProps {
  contentType: 'anime' | 'manga';
  onSearch: (params: SearchParams) => void;
  onFilterChange: (params: SearchParams) => void;
  isLoading?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  contentType,
  onSearch,
  onFilterChange,
  isLoading = false,
  onClose,
}) => {
  return (
    <div className="w-full lg:w-80 flex-none bg-white dark:bg-gray-800 p-4 rounded-none lg:rounded-lg shadow-lg h-full lg:h-auto lg:overflow-visible overflow-y-auto max-h-[calc(100vh-0)] lg:max-h-none shadow-lg border border-gray-700/30 relative">
      <button
        onClick={() => onClose?.()}
        className="absolute top-2 right-2 lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <SearchBar
        onSearch={onSearch}
        isLoading={isLoading}
        placeholder={`Search ${contentType}...`}
      />
      <Filters
        contentType={contentType}
        onFilterChange={onFilterChange}
      />
    </div>
  );
};

export default Sidebar;