import React from 'react';
import { clearWishlistByType,WishlistItem, removeFromWishlist, getWishlistItems } from '../api/wishlistService';
import { getAnimeById, getMangaById, AnimeItem, MangaItem } from '../api/jikanApi';
import { useNavigate } from 'react-router-dom';
import ItemCard from './ItemCard';

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = React.useState<WishlistItem[]>([]);
  const [itemDetails, setItemDetails] = React.useState<{[key: number]: AnimeItem | MangaItem}>({});
  const [activeTab, setActiveTab] = React.useState<'anime' | 'manga'>('anime');
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();

  // Function to get item details from Jikan API
  const getItemDetails = async (id: number, type: 'anime' | 'manga') => {
    try {
      const response = type === 'anime' 
        ? await getAnimeById(id)
        : await getMangaById(id);
      setItemDetails(prev => ({ ...prev, [id]: response.data }));
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
    }
  };

  // Load wishlist items and their details on component mount
  React.useEffect(() => {
    const loadItemsAndDetails = async () => {
      setIsLoading(true);
      const items = getWishlistItems();
      setWishlistItems(items);

      // Fetch details for each item
      await Promise.all(
        items.map(item => getItemDetails(item.id, item.type))
      );
      
      setIsLoading(false);
    };

    loadItemsAndDetails();
  }, []);

  // Handle removing item from wishlist
  const handleRemoveItem = (id: number, type: 'anime' | 'manga') => {
    removeFromWishlist(id, type);
    setWishlistItems(getWishlistItems());
  };

  // Navigate to detail page
  const handleItemClick = (id: number, type: 'anime' | 'manga') => {
    navigate(`/${type}/${id}`);
  };

  // Handle removing all items of current type from wishlist
  const handleRemoveAllByType = () => {
    clearWishlistByType(activeTab);
    setWishlistItems(getWishlistItems());
  };

  // Filter items by type
  const filteredItems = wishlistItems.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen py-8 px-4 transition-all duration-300">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">My Wishlist</h1>
      {/* Tab Navigation */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('anime')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${activeTab === 'anime' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'text-gray-700 dark:text-white '}`}
          >
            Anime
          </button>
          <button
            onClick={() => setActiveTab('manga')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${activeTab === 'manga' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'text-gray-700 dark:text-white'}`}
          >
            Manga
          </button>
        </div>
        {filteredItems.length > 0 && (
          <button
            onClick={handleRemoveAllByType}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
          >
            Remove All {activeTab === 'anime' ? 'Anime' : 'Manga'}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-16 bg-gray-100 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 max-w-lg mx-auto">
          <p className="text-gray-700 dark:text-gray-300 text-lg">Loading wishlist items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-100 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 max-w-lg mx-auto">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">Your {activeTab} wishlist is empty.</p>
          <button
            onClick={() => navigate(activeTab === 'anime' ? '/' : '/manga')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Browse {activeTab === 'anime' ? 'Anime' : 'Manga'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
          {filteredItems.map((item) => (
            <div key={item.id} className="animate-slide-up">
              <ItemCard
                item={itemDetails[item.id] || {
                  mal_id: item.id,
                  title: item.title,
                  images: { jpg: { image_url: item.image } },
                  type: item.type,
                  episodes: undefined,
                  chapters: undefined,
                  status: 'Unknown',
                  rating: 'Unknown',
                  score: 0
                }}
                type={item.type}
                onAddToWishlist={() => handleRemoveItem(item.id, item.type)}
                isInWishlist={true}
                onClick={() => handleItemClick(item.id, item.type)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
