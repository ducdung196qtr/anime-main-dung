import React from 'react';
import { AnimeItem, MangaItem } from '../api/jikanApi';
import ItemCard from './ItemCard';
import Pagination from './Pagination';

interface ResultsGridProps {
  items: (AnimeItem | MangaItem)[];
  type: 'anime' | 'manga';
  isLoading: boolean;
  onItemClick: (id: number) => void;
  onAddToWishlist: (item: AnimeItem | MangaItem) => void;
  isInWishlist: (id: number) => boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({
  items,
  type,
  isLoading,
  onItemClick,
  onAddToWishlist,
  isInWishlist,
  currentPage,
  totalPages,
  onPageChange
}) => {

  if (items.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No results found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item) => (
          <ItemCard
            key={item.mal_id}
            item={item}
            type={type}
            onAddToWishlist={() => onAddToWishlist(item)}
            isInWishlist={isInWishlist(item.mal_id)}
            onClick={() => onItemClick(item.mal_id)}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
        </div>
      )}

      {!isLoading && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ResultsGrid;
