import React, { useState, useRef, useEffect, lazy, Suspense, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from "./pages/components/LoadingIndicator";
import { AuthProvider, AuthContext } from "./pages/components/AuthContext";
import { api } from "./pages/components/api";
import backgroundImage from "@img/background2.webp";

import "tailwindcss/tailwind.css";
import "./styles/loading.css";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const AboutMe = lazy(() => import("./pages/AboutMe"));
const Post = lazy(() => import("./pages/Post"));
const PostUpload = lazy(() => import("./pages/PostUpload"));
const Scrap = lazy(() => import("./pages/Scrap"));
const RustNews = lazy(() => import("./pages/RustNews"));
const BitcoinPricePage = lazy(() => import("./pages/BitcoinPricePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Logout = lazy(() => import("./pages/components/Logout"));
const Signup = lazy(() => import("./pages/Signup"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Footer = lazy(() => import("./pages/components/Footer"));
const HamburgerButton = lazy(() =>
  import("./pages/components/HamburgerButton")
);
const SearchResults = lazy(() => import("./pages/components/SearchResults"));
const OAuthCallback = lazy(() => import("./pages/components/OAuthCallback"));
const SystemStack = lazy(() => import("./pages/SystemStack"));

const ActivityMonitor = lazy(() =>
  import("./pages/components/ActivityMonitor")
);

function AppContent() {
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(30 * 60 * 1000); // 30 minutes
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext); // Get user information from AuthContext

  const navigate = useNavigate();

  const resetSearchState = () => {
    setIsSearchInputVisible(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        resetSearchState();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchInputVisible) {
      setIsSearchAnimating(true);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      const timer = setTimeout(() => {
        setIsSearchAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isSearchInputVisible]);

  const toggleSearchInput = () => {
    setIsSearchInputVisible((prev) => !prev);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const postResponse = await api.get("/api/v1/posts/search", {
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

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSearchInput();
    // Prevent zoom on mobile devices
    document.body.style.touchAction = 'manipulation';
  };

  // Hamburger button click handler
  const handleHamburgerClick = () => {
    resetSearchState();
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const formatTimeForMobile = (ms) => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes}m`;
  };

  const handleProfileClick = () => {
    navigate('/edit-profile');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <header>
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 bg-white text-black h-[50px] sm:h-[60px] font-serif z-50">
          <Link to="/" className="text-lg sm:text-xl">
            Our Journey
          </Link>
          <div className="flex items-center" ref={searchRef}>
            {isLoggedIn && user && (
              <>
                <span className="hidden md:inline-block mr-4 text-xs sm:text-sm">
                  Remaining login time: {formatTime(remainingTime)}
                </span>
                <span className="md:hidden mr-2 text-xs">
                  {formatTimeForMobile(remainingTime)}
                </span>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer mr-2"
                    onClick={handleProfileClick}
                  />
                )}
              </>
            )}
            <div className="relative mr-2 sm:mr-4">
              <button
                onClick={handleSearchButtonClick}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              <div
                className={`absolute right-0 mt-2 overflow-hidden transition-all duration-300 ease-out
                  ${isSearchInputVisible ? 'w-64' : 'w-0'}`}
              >
                <form
                  onSubmit={handleSearch}
                  className={`w-64 transition-opacity duration-300 ease-out
                    ${isSearchAnimating ? 'opacity-100' : 'opacity-0'}`}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ElasticSearch is not yet implemented..."
                    className="w-full px-3 py-1 sm:px-4 sm:py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ fontSize: '16px' }}
                  />
                </form>
              </div>
            </div>
            <Suspense fallback={<LoadingIndicator />}>
              <HamburgerButton onClick={handleHamburgerClick} />
            </Suspense>
          </div>
        </nav>
      </header>
      <main className="flex-grow mt-[50px] sm:mt-[60px]">
        {isSearchOpen && (
          <section className="w-full md:w-2/3 bg-white shadow-md z-50">
            <Suspense fallback={<LoadingIndicator />}>
              <SearchResults
                results={searchResults}
                onClose={() => setIsSearchOpen(false)}
              />
            </Suspense>
          </section>
        )}
        <Suspense fallback={<LoadingIndicator />}>
          <ActivityMonitor onTimeUpdate={setRemainingTime} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route path="/post/upload" element={<PostUpload />} />
            <Route path="/scrap" element={<Scrap />} />
            <Route path="/rust-news" element={<RustNews />} />
            <Route path="/bitcoin-price" element={<BitcoinPricePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/github/callback" element={<OAuthCallback />} />
            <Route path="/auth/google/callback" element={<OAuthCallback />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/system-stack" element={<SystemStack />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="sm:text-sm md:text-base"
        toastClassName={() =>
          "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white bg-clip-padding border border-gray-200 shadow-lg"
        }
        bodyClassName={() => "flex text-black font-medium block p-3"}
      />
      <footer className="fixed bottom-0 left-0 right-0 bg-white">
        <Suspense fallback={<LoadingIndicator />}>
          <Footer />
        </Suspense>
      </footer>
    </div>
  );
}

// App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;