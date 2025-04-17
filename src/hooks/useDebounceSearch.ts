import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

/**
 * Custom hook for implementing search with debouncing
 * 
 * @param initialValue - Initial search term
 * @param delay - Debounce delay in milliseconds
 * @returns Object containing search term, debounced search term, and setter function
 */
export function useDebounceSearch(initialValue: string = '', delay: number = 500) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  // Create a debounced function that updates debouncedSearchTerm
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, delay),
    [delay]
  );

  // Update the debounced value when searchTerm changes
  useEffect(() => {
    debouncedSetSearch(searchTerm);
    
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchTerm, debouncedSetSearch]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm
  };
}

export default useDebounceSearch;
