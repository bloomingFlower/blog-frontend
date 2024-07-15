import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from "./pages/components/LoadingIndicator";
import { AuthProvider, AuthContext } from "./pages/components/AuthContext";
import api from "./pages/components/api";

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
const Logout = lazy(() => import("./pages/components/Logout"));
const Signup = lazy(() => import("./pages/Signup"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Footer = lazy(() => import("./pages/components/Footer"));
const HamburgerButton = lazy(() =>
  import("./pages/components/HamburgerButton")
);
const SearchResults = lazy(() => import("./pages/components/SearchResults"));
const SystemStack = lazy(() => import("./pages/SystemStack"));
const ActivityMonitor = lazy(() =>
  import("./pages/components/ActivityMonitor")
);

function App() {
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(30 * 60 * 1000); // 30분

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
      const postResponse = await api.get("/api/posts/search", {
        params: { query: searchQuery },
      });

      setSearchResults(
        postResponse.data.data.map((post) => ({ ...post, type: "post" }))
      );
      setIsSearchOpen(true);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
    if (!isSearchInputVisible) {
      setIsSearchOpen(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <nav className="fixed top-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 bg-white text-black h-[50px] sm:h-[60px] font-serif z-50">
            <Link to="/" className="text-lg sm:text-xl">
              Our Journey
            </Link>
            <div className="flex items-center" ref={searchRef}>
              <AuthContext.Consumer>
                {({ isLoggedIn }) =>
                  isLoggedIn && (
                    <span className="hidden md:inline-block mr-4 text-xs sm:text-sm">
                      Remaining login time: {formatTime(remainingTime)}
                    </span>
                  )
                }
              </AuthContext.Consumer>
              <div className="relative mr-2 sm:mr-4">
                <button
                  onClick={toggleSearchInput}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-5000"
                  aria-label="Search"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                {isSearchInputVisible && (
                  <form
                    onSubmit={handleSearch}
                    className="absolute right-0 mt-2 w-64"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full px-3 py-1 sm:px-4 sm:py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </form>
                )}
              </div>
              <Suspense fallback={<LoadingIndicator />}>
                <HamburgerButton />
              </Suspense>
            </div>
          </nav>
          <main className="flex-grow mt-[50px] sm:mt-[60px]">
            {isSearchOpen && (
              <div className="w-full md:w-2/3 bg-white shadow-md z-50">
                <Suspense fallback={<LoadingIndicator />}>
                  <SearchResults
                    results={searchResults}
                    onClose={() => setIsSearchOpen(false)}
                  />
                </Suspense>
              </div>
            )}
            <Suspense fallback={<LoadingIndicator />}>
              <ActivityMonitor onTimeUpdate={setRemainingTime} />
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
          </main>
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
