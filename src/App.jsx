import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from './pages/components/LoadingIndicator';
import { AuthProvider } from './pages/components/AuthContext';
import api from './pages/components/api';

import "tailwindcss/tailwind.css";
import "./styles/loading.css";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Post = lazy(() => import("./pages/Post"));
const PostUpload = lazy(() => import("./pages/PostUpload"));
const Scrap = lazy(() => import("./pages/Scrap"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Logout = lazy(() => import('./pages/components/Logout'));
const Signup = lazy(() => import('./pages/Signup'));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Footer = lazy(() => import("./pages/components/Footer"));
const HamburgerButton = lazy(() => import("./pages/components/HamburgerButton"));
const SearchResults = lazy(() => import('./pages/components/SearchResults'));
const SystemStack = lazy(() => import("./pages/SystemStack"));

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const searchRef = useRef();
  const searchInputRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsSearchInputVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchInputVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchInputVisible]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const [postResponse, scrapResponse] = await Promise.all([
        api.get('/api/posts/search', { params: { query: searchQuery } }),
        api.get('/api/scraps/search', { params: { query: searchQuery } })
      ]);

      setSearchResults([
        ...postResponse.data.data.map(post => ({ ...post, type: 'post' })),
        ...scrapResponse.data.data.map(scrap => ({ ...scrap, type: 'scrap' }))
      ]);
      setIsSearchOpen(true);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  };

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
    if (!isSearchInputVisible) {
      setIsSearchOpen(false);
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div>
          <nav className="flex items-center justify-between p-3 bg-white text-black h-[60%] font-serif relative">
            <Link to="/" className="text-xl">Our Journey</Link>
            <div className="flex items-center" ref={searchRef}>
              <div className="relative mr-4">
                <button onClick={toggleSearchInput} className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {isSearchInputVisible && (
                  <form onSubmit={handleSearch} className="absolute right-0 mt-2 w-64">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </form>
                )}
              </div>
              <Suspense fallback={<LoadingIndicator />}>
                <HamburgerButton style={{ width: "40px", height: "40px" }} />
              </Suspense>
            </div>
          </nav>
          {isSearchOpen && (
            <div className="absolute top-16 right-0 w-full md:w-2/3 bg-white shadow-md z-50">
              <Suspense fallback={<LoadingIndicator />}>
                <SearchResults results={searchResults} onClose={() => setIsSearchOpen(false)} />
              </Suspense>
            </div>
          )}
          <Suspense fallback={<LoadingIndicator />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post" element={<Post />} />
              <Route path="/post/upload" element={<PostUpload />} />
              <Route path="/scrap" element={<Scrap />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/system-stack" element={<SystemStack />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ToastContainer />
          <Suspense fallback={<LoadingIndicator />}>
            <Footer />
          </Suspense>
        </div>
      </Router>
      <LoadingIndicator />
    </AuthProvider>
  );
}

export default App;