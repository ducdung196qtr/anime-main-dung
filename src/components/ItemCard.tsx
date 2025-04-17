import React from 'react';
import { AnimeItem, MangaItem } from '../api/jikanApi';

interface ItemCardProps {
  item: AnimeItem | MangaItem;
  type: 'anime' | 'manga';
  onAddToWishlist: () => void;
  isInWishlist: boolean;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  type,
  onAddToWishlist,
  isInWishlist,
  onClick
}) => {
  // Determine if item is anime or manga based on type
  const isAnime = type === 'anime';
  
  // Get appropriate properties based on item type
  const episodes = isAnime ? (item as AnimeItem).episodes : (item as MangaItem).chapters;
  const status = isAnime ? (item as AnimeItem).status : (item as MangaItem).status;
  const rating = isAnime ? (item as AnimeItem).rating : 'N/A';
  
  return (
    <div className="bg-gray-200/50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 text-gray-900 dark:text-white h-full flex flex-col">
      <div className="relative cursor-pointer group" onClick={onClick}>
        <img 
          src={item.images.jpg.image_url} 
          alt={item.title}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {item.score ? `★ ${item.score}` : 'No rating'}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 min-h-[3rem] text-gray-900 dark:text-white hover:text-blue-400 cursor-pointer transition-colors duration-300" onClick={onClick}>
          {item.title}
        </h3>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-1">
          <div className="flex justify-between mb-1">
            <span>Type:</span>
            <span className="font-medium">{item.type}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span>{isAnime ? 'Episodes:' : 'Chapters:'}</span>
            <span className="font-medium">{episodes || 'Unknown'}</span>
          </div>
          
          <div className="flex justify-between mb-1">
            <span>Status:</span>
            <span className="font-medium">{status}</span>
          </div>
          
          {isAnime && (
            <div className="flex justify-between">
              <span>Rating:</span>
              <span className="font-medium">{rating}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist();
          }}
          className={`w-full py-2 px-4 rounded-md transition-all duration-300 text-sm sm:text-base font-medium ${isInWishlist
              ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-pink-600 hover:to-red-600'
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
          }`}
        >
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
