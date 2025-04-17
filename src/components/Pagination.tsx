import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) {
      rangeWithDots.push(1, '...');
    } else if (range[0] === 2) {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (range[range.length - 1] === totalPages - 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 my-4 sm:my-8 sm:space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 text-sm sm:px-3 sm:text-base rounded ${
          currentPage === 1 
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
            : 'bg-white dark:bg-gray-700 bg-gray-200 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          disabled={page === '...'}
          className={`px-2 py-1 text-sm sm:px-3 sm:text-base rounded ${
            page === currentPage 
              ? 'bg-blue-500 dark:bg-blue-600 text-white border border-blue-600 dark:border-blue-700' 
              : page === '...' 
                ? 'cursor-default text-gray-600 dark:text-gray-400' 
                : 'bg-white dark:bg-gray-700 bg-gray-200 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 text-sm sm:px-3 sm:text-base rounded ${
          currentPage === totalPages 
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
            : 'bg-white dark:bg-gray-700 bg-gray-200 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;