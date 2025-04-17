import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, getMangaById, AnimeItem, MangaItem } from '../api/jikanApi';
import { addToWishlist, removeFromWishlist, isInWishlist, WishlistItem } from '../api/wishlistService';

interface DetailPageProps {
  contentType: 'anime' | 'manga';
}

const DetailPage: React.FC<DetailPageProps> = ({ contentType }) => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<AnimeItem | MangaItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const itemId = parseInt(id, 10);
        
        // Fetch data based on content type
        const response = contentType === 'anime' 
          ? await getAnimeById(itemId)
          : await getMangaById(itemId);
        
        setItem(response.data);
        
        // Check if item is in wishlist
        setInWishlist(isInWishlist(itemId, contentType));
        
      } catch (err) {
        setError('Failed to fetch details. Please try again.');
        console.error('Error fetching item details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItemDetails();
  }, [id, contentType]);

  const handleWishlistToggle = () => {
    if (!item) return;
    
    if (inWishlist) {
      removeFromWishlist(item.mal_id, contentType);
    } else {
      const wishlistItem: WishlistItem = {
        id: item.mal_id,
        type: contentType,
        title: item.title,
        image: item.images.jpg.image_url
      };
      addToWishlist(wishlistItem);
    }
    
    setInWishlist(!inWishlist);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Item not found'}
        </div>
      </div>
    );
  }

  // Determine if item is anime or manga
  const isAnime = contentType === 'anime';
  
  // Get appropriate properties based on item type
  const animeItem = isAnime ? item as AnimeItem : null;
  const mangaItem = !isAnime ? item as MangaItem : null;
  
  return (
    <div className="container mx-auto py-8 bg-white dark:bg-gray-900">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">

        {/* Header with image and basic info */}
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img 
              src={item.images.jpg.large_image_url} 
              alt={item.title}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="p-4 md:p-6 w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <button
                onClick={handleWishlistToggle}
                className={`py-3 px-8 rounded-lg transition-all duration-300 text-sm sm:text-base font-medium whitespace-nowrap mb-4 md:mb-0 ${ inWishlist
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-pink-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
              }`}
              >
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{item.title}</h1>
            </div>
            
            {item.title_english && item.title_english !== item.title && (
              <h2 className="text-xl text-gray-400 mb-4">{item.title_english}</h2>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 dark:text-gray-300">Type: <span className="font-medium text-gray-900 dark:text-white">{item.type}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Score: <span className="font-medium text-gray-900 dark:text-white">{item.score || 'N/A'}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Rank: <span className="font-medium text-gray-900 dark:text-white">#{item.rank || 'N/A'}</span></p>
                <p className="text-gray-600 dark:text-gray-300">Popularity: <span className="font-medium text-gray-900 dark:text-white">#{item.popularity || 'N/A'}</span></p>
              </div>
              
              <div>
                {isAnime ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-300">Episodes: <span className="font-medium text-gray-900 dark:text-white">{animeItem?.episodes || 'Unknown'}</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Status: <span className="font-medium text-gray-900 dark:text-white">{animeItem?.status}</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Aired: <span className="font-medium text-gray-900 dark:text-white">{animeItem?.aired.from ? new Date(animeItem.aired.from).toLocaleDateString() : 'Unknown'}</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Rating: <span className="font-medium text-gray-900 dark:text-white">{animeItem?.rating || 'Unknown'}</span></p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 dark:text-gray-300">Chapters: <span className="font-medium text-gray-900 dark:text-white">{mangaItem?.chapters || 'Unknown'}</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Volumes: <span className="font-medium text-gray-900 dark:text-white">{mangaItem?.volumes || 'Unknown'}</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Status: <span className="font-medium text-gray-900 dark:text-white">{mangaItem?.status}</span></p>
                    <p className="text-gray-600 dark:text-gray-300">Published: <span className="font-medium text-gray-900 dark:text-white">{mangaItem?.published.from ? new Date(mangaItem.published.from).toLocaleDateString() : 'Unknown'}</span></p>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-black dark:text-white">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {item.genres.map(genre => (
                  <span key={genre.mal_id} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Synopsis */}
        <div className="p-6 border-t border-gray-300 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">Synopsis</h3>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{item.synopsis || 'No synopsis available.'}</p>
        </div>
        
        {/* Trailer (Anime only) */}
        {isAnime && animeItem?.trailer.youtube_id && (
          <div className="p-6 border-t border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Trailer</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${animeItem.trailer.youtube_id}`}
                title="Trailer"
                className="w-full h-96"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Studios (Anime only) */}
        {isAnime && animeItem?.studios && animeItem.studios.length > 0 && (
          <div className="p-6 border-t border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">Studios</h3>
            <div className="flex flex-wrap gap-2">
              {animeItem.studios.map(studio => (
                <span key={studio.mal_id} className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {studio.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Authors (Manga only) */}
        {!isAnime && mangaItem?.authors && mangaItem.authors.length > 0 && (
          <div className="p-6 border-t border-gray-300 dark:border-gray-700">

            <h3 className="text-xl font-semibold mb-4 text-white">Authors</h3>

            <div className="flex flex-wrap gap-2">
              {mangaItem.authors.map(author => (
                <span key={author.mal_id} className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                  {author.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Background */}
        {item.background && (
          <div className="p-6 border-t border-gray-300 dark:border-gray-700">

            <h3 className="text-xl font-semibold mb-4">Background</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{item.background}</p>

          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
