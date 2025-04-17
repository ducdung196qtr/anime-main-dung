import React, { useState } from 'react';
import FilterGroup from './FilterGroup';
import {
  ANIME_TYPES,
  MANGA_TYPES,
  STATUS_OPTIONS,
  MANGA_STATUS_OPTIONS,
  RATING_OPTIONS,
  COMMON_GENRES,
  SORT_OPTIONS
} from '../constants/filterOptions';
import { SearchParams } from '../api/jikanApi';

interface FiltersProps {
  contentType: 'anime' | 'manga';
  onFilterChange: (params: SearchParams) => void;
}

const Filters: React.FC<FiltersProps> = ({ contentType, onFilterChange }) => {
  // State for each filter category
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Determine which type options to use based on content type
  const typeOptions = contentType === 'anime' ? ANIME_TYPES : MANGA_TYPES;
  const statusOptions = contentType === 'anime' ? STATUS_OPTIONS : MANGA_STATUS_OPTIONS;

  // Handle filter changes
  const updateFilters = (updates: Partial<{
    type: string;
    status: string;
    rating: string;
    genre: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }>) => {
    const newType = updates.type !== undefined ? updates.type : type;
    const newStatus = updates.status !== undefined ? updates.status : status;
    const newRating = updates.rating !== undefined ? updates.rating : rating;
    const newGenre = updates.genre !== undefined ? updates.genre : genre;
    const newSortBy = updates.sortBy !== undefined ? updates.sortBy : sortBy;
    const newSortOrder = updates.sortOrder !== undefined ? updates.sortOrder : sortOrder;

    const params: SearchParams = {
      order_by: newSortBy,
      sort: newSortOrder
    };

    if (newType) params.type = newType.toLowerCase();
    if (newStatus) params.status = newStatus;
    if (newRating && contentType === 'anime') params.rating = newRating;
    if (newGenre) params.genres = newGenre;

    return params;
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    const params = updateFilters({ type: value });
    onFilterChange(params);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    const params = updateFilters({ status: value });
    onFilterChange(params);
  };

  const handleRatingChange = (value: string) => {
    setRating(value);
    const params = updateFilters({ rating: value });
    onFilterChange(params);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    const params = updateFilters({ genre: value });
    onFilterChange(params);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const params = updateFilters({ sortBy: value });
    onFilterChange(params);
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const params = updateFilters({ sortOrder: newSortOrder });
    onFilterChange(params);
  };

  // Reset all filters
  const resetFilters = () => {
    // Reset all state values
    setType('');
    setStatus('');
    setRating('');
    setGenre('');
    setSortBy('score');
    setSortOrder('desc');

    // Call onFilterChange with all reset params to ensure synchronization
    onFilterChange({
      type: '',
      status: '',
      rating: '',
      genres: '',
      order_by: 'score',
      sort: 'desc'
    });
  };

  return (
    <div className="mt-4 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Filters</h2>
        <button
          onClick={resetFilters}
          className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 ease-in-out rounded-full border  hover:bg-indigo-100 dark:hover:bg-indigo-50/30 border-gray-700 dark:border-gray-200"
        >
          <svg 
            className="w-6 h-6 stroke-gray-700 dark:stroke-gray-200 transition-colors duration-300" 
            viewBox="0 0 21 21" 
            xmlns="http://www.w3.org/2000/svg"
          > 
            <g 
              fill="none" 
              fillRule="evenodd" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              transform="matrix(0 1 1 0 2.5 2.5)"
            > 
              <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path> 
              <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"></path> 
            </g> 
          </svg>
          Reset Filters
        </button>
      </div>

      <FilterGroup
        title="Type"
        options={typeOptions}
        selectedValue={type}
        onChange={handleTypeChange}
      />

      <FilterGroup
        title="Status"
        options={statusOptions}
        selectedValue={status}
        onChange={handleStatusChange}
      />

      {contentType === 'anime' && (
        <FilterGroup
          title="Rating"
          options={RATING_OPTIONS}
          selectedValue={rating}
          onChange={handleRatingChange}
        />
      )}

      <FilterGroup
        title="Genre"
        options={COMMON_GENRES}
        selectedValue={genre}
        onChange={handleGenreChange}
      />

      <div className="mb-8 border-t border-gray-700/30 pt-6">
        <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Sort By</h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2 flex-1">
            {SORT_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2.5 rounded-lg cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg ${sortBy === option.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-700 dark:text-gray-200 hover:text-white'
                  }`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
              setSortOrder(newSortOrder);
              const params = updateFilters({ sortOrder: newSortOrder });
              onFilterChange(params);
            }}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gradient-to-r from-indigo-500 to-purple-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all duration-300"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
