import React, { useState, useEffect } from 'react';
import { searchAnime, searchManga, AnimeItem, MangaItem, SearchParams, JikanResponse } from '../api/jikanApi';
import ResultsGrid from './ResultsGrid';
import Sidebar from './Sidebar';
import { addToWishlist, isInWishlist, removeFromWishlist, WishlistItem } from '../api/wishlistService';
import { useNavigate } from 'react-router-dom';

interface SearchPageProps {
  contentType: 'anime' | 'manga';
}

const SearchPage: React.FC<SearchPageProps> = ({ contentType }) => {
  const [items, setItems] = useState<(AnimeItem | MangaItem)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentParams, setCurrentParams] = useState<SearchParams>({});
  const [showSidebar, setShowSidebar] = useState(false);
  
  const navigate = useNavigate();

  const fetchData = React.useCallback(async (params: SearchParams) => {
    const maxRetries = 3;
    const baseDelay = 1000;
    let retryCount = 0;

    const attemptFetch = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        
        const searchParams = {
          ...params,
          limit: 12,
          order_by: params.order_by || 'score',
          sort: params.sort || 'desc'
        };
        
        const response: JikanResponse<(AnimeItem | MangaItem)[]> = 
          contentType === 'anime' 
            ? await searchAnime(searchParams) 
            : await searchManga(searchParams);
        
        setItems(response.data);
        setTotalPages(response.pagination?.last_visible_page || 1);
        setCurrentPage(params.page || 1);
        
      } catch (err: any) {
        if (err.response?.status === 429 && retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount);
          retryCount++;
          setError(`Rate limit exceeded. Retrying in ${delay/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptFetch();
        }
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    return attemptFetch();
  }, [contentType]);

  const handleSearch = React.useCallback((params: SearchParams) => {
    const newParams = {
      ...params,
      page: 1,
      limit: 12,
      order_by: params.order_by || 'score',
      sort: params.sort || 'desc'
    };
    setIsLoading(true);
    setError(null);
    setItems([]);
    setCurrentParams(newParams);
    fetchData(newParams);
  }, [fetchData]);

  const handleFilterChange = (filterParams: SearchParams) => {
    const newParams = {
      ...currentParams,
      ...filterParams,
      page: 1,
      limit: 12
    };
    setIsLoading(true);
    setError(null);
    setItems([]);
    setCurrentParams(newParams);
    fetchData(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    if (!isLoading && newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
      const newParams = { 
        ...currentParams, 
        page: newPage,
        limit: 12
      };
      setIsLoading(true);
      setError(null);
      setItems([]);
      setCurrentParams(newParams);
      fetchData(newParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle item click to navigate to detail page
  const handleItemClick = (id: number) => {
    navigate(`/${contentType}/${id}`);
  };

  // Handle add/remove from wishlist
  const handleAddToWishlist = (item: AnimeItem | MangaItem) => {
    const wishlistItem: WishlistItem = {
      id: item.mal_id,
      type: contentType,
      title: item.title,
      image: item.images.jpg.image_url
    };
    
    if (isInWishlist(item.mal_id, contentType)) {
      removeFromWishlist(item.mal_id, contentType);
    } else {
      addToWishlist(wishlistItem);
    }
    // Force re-render to update wishlist button state
    setItems([...items]);
  };

  // Check if item is in wishlist
  const checkIsInWishlist = (id: number) => {
    return isInWishlist(id, contentType);
  };


  // Add useEffect to fetch initial data
  // Update the useEffect to include fetchData in dependencies
  useEffect(() => {
    fetchData({ page: 1, limit: 12, order_by: 'score', sort: 'desc' });
  }, [fetchData]);

  return (
    <div className="max-w-[1400px] mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 text-gray-900 dark:text-gray-100 relative">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        {contentType === 'anime' ? 'Anime' : 'Manga'} Library
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6"> 
        <div className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity duration-300 ${showSidebar ? 'opacity-100 z-40' : 'opacity-0 -z-10'}`} onClick={() => setShowSidebar(false)} />
        <div className={`fixed lg:relative top-0 left-0 h-full w-80 lg:w-auto transform transition-transform duration-300 z-50 lg:z-auto lg:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar
            contentType={contentType}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed bottom-4 right-4 lg:hidden z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-sm sm:text-base">
              {error}
            </div>
          )}
          
          <ResultsGrid 
            items={items}
            type={contentType}
            isLoading={isLoading}
            onItemClick={handleItemClick}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={checkIsInWishlist}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
