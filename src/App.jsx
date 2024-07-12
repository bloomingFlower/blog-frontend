import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Post from "./pages/Post";
import PostUpload from "./pages/PostUpload";
import Scrap from "./pages/Scrap";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Logout from './pages/components/Logout';
import Signup from './pages/Signup';
import EditProfile from "./pages/EditProfile";
import Footer from "./pages/components/Footer";
import LoadingIndicator from './pages/components/LoadingIndicator';
import HamburgerButton from "./pages/components/HamburgerButton";
import { AuthContext, AuthProvider } from './pages/components/AuthContext';
import SearchResults from './pages/components/SearchResults';
import api from './pages/components/api';

import "tailwindcss/tailwind.css";
import "./styles/loading.css";
import SystemStack from "./pages/SystemStack";

function App() {
  const [data, setData] = useState(null);
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
  }, [searchRef]);

  useEffect(() => {
    if (isSearchInputVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchInputVisible]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/data`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning('Please enter a search term');
      return;
    }
    try {
      const [postResponse, scrapResponse] = await Promise.all([
        api.get('/api/posts/search', { params: { query: searchQuery } }),
        api.get('/api/scraps/search', { params: { query: searchQuery } })
      ]);

      const postResults = postResponse.data.data.map(post => ({ ...post, type: 'post' }));
      const scrapResults = scrapResponse.data.data.map(scrap => ({ ...scrap, type: 'scrap' }));

      setSearchResults([...postResults, ...scrapResults]);
      setIsSearchOpen(true);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      toast.error('Failed to fetch search results');
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
          <nav
            className="flex items-center justify-between p-3"
            style={{
              backgroundColor: "white",
              color: "black",
              height: "60%",
              fontFamily: "PlayfairDisplay, serif",
              position: "relative",
            }}
          >
            <Link to="/" className="text-xl">
              Our Journey
            </Link>
            <div className="flex items-center" ref={searchRef}>
              <div className="relative mr-4">
                <button
                  onClick={toggleSearchInput}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
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
              <HamburgerButton style={{ width: "40px", height: "40px" }} />
            </div>
          </nav>
          {isSearchOpen && (
            <div className="absolute top-16 right-0 w-full md:w-2/3 bg-white shadow-md z-50">
              <SearchResults results={searchResults} onClose={() => setIsSearchOpen(false)} />
            </div>
          )}
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
          <ToastContainer />
          <Footer />
        </div>
      </Router>
      <LoadingIndicator />
    </AuthProvider>
  );
}

export default App;