/**
 * Wishlist Storage Service
 * 
 * This file contains utility functions for managing the wishlist
 * using localStorage for persistent storage.
 */

// Type for wishlist items
export interface WishlistItem {
  id: number;
  type: 'anime' | 'manga';
  title: string;
  image: string;
}

// LocalStorage key
const WISHLIST_STORAGE_KEY = 'anime-manga-app-wishlist';

/**
 * Get all items in the wishlist
 */
export function getWishlistItems(): WishlistItem[] {
  try {
    const storedItems = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error('Error retrieving wishlist from localStorage:', error);
    return [];
  }
}

/**
 * Add an item to the wishlist
 * Returns true if added, false if already exists
 */
export function addToWishlist(item: WishlistItem): boolean {
  try {
    const currentItems = getWishlistItems();
    
    // Check if item already exists in wishlist
    const exists = currentItems.some(
      existingItem => existingItem.id === item.id && existingItem.type === item.type
    );
    
    if (!exists) {
      const updatedItems = [...currentItems, item];
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedItems));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    return false;
  }
}

/**
 * Remove an item from the wishlist
 * Returns true if removed, false if not found
 */
export function removeFromWishlist(id: number, type: 'anime' | 'manga'): boolean {
  try {
    const currentItems = getWishlistItems();
    const initialLength = currentItems.length;
    
    const updatedItems = currentItems.filter(
      item => !(item.id === id && item.type === type)
    );
    
    if (updatedItems.length !== initialLength) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedItems));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return false;
  }
}

/**
 * Check if an item is in the wishlist
 */
export function isInWishlist(id: number, type: 'anime' | 'manga'): boolean {
  try {
    const currentItems = getWishlistItems();
    return currentItems.some(
      item => item.id === id && item.type === type
    );
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
}

/**
 * Clear all items of a specific type from the wishlist
 */
export function clearWishlistByType(type: 'anime' | 'manga'): boolean {
  try {
    const currentItems = getWishlistItems();
    const updatedItems = currentItems.filter(item => item.type !== type);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error('Error clearing wishlist by type:', error);
    return false;
  }
}

/**
 * Clear the entire wishlist
 */
export function clearWishlist(): void {
  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing wishlist:', error);
  }
}

export default {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist
};
