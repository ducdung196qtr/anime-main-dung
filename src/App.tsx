import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import WishlistPage from './components/WishlistPage';
import DetailPage from './components/DetailPage';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ui/ThemeToggle';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <Router>
      <div className="min-h-screen bg-gray-200/50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <nav className="bg-gray-200 dark:bg-gray-800 transition-colors duration-300 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center">
                <Link to="/" className="flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300">
                  <img src="/logo.png" alt="Logo" className="w-24 md:w-32 mr-3 hover:scale-105 transition-transform duration-300" />
                </Link>
              </div>

              {/* Mobile menu button and theme toggle */}
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-300"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  Anime
                </Link>
                <Link to="/manga" className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  Manga
                </Link>
                <Link to="/wishlist" className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
                  My Wishlist
                </Link>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden pb-3`}>
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Anime
                </Link>
                <Link 
                  to="/manga" 
                  className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manga
                </Link>
                <Link 
                  to="/wishlist" 
                  className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Wishlist
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-6 px-4 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<SearchPage contentType="anime" />} />
            <Route path="/manga" element={<SearchPage contentType="manga" />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/anime/:id" element={<DetailPage contentType="anime" />} />
            <Route path="/manga/:id" element={<DetailPage contentType="manga" />} />
          </Routes>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 shadow-inner py-6 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <p>Footer Anime-Manga</p>
          </div>
        </footer>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;
