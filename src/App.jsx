import React, {
  useState,
  useRef,
  useEffect,
  lazy,
  Suspense,
  useContext,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndicator from "./pages/components/LoadingIndicator";
import { AuthProvider, AuthContext } from "./pages/components/AuthContext";
import { api } from "./pages/components/api";
import backgroundImage from "@img/background2.webp";
import { HelmetProvider } from 'react-helmet-async';

import "tailwindcss/tailwind.css";
import "./styles/loading.css";
import "./styles/PlaygroundEditorTheme.css";

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
const SinglePostPage = lazy(() => import("./pages/SinglePostPage"));
const MobileRSSViewer = lazy(() => import("./pages/MobileRSSViewer"));

const ActivityMonitor = lazy(() =>
  import("./pages/components/ActivityMonitor")
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function AppContent() {
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [remainingTime, setRemainingTime] = useState(30 * 60 * 1000); // 초기값으로 30분 설정
  const [isSearchAnimating, setIsSearchAnimating] = useState(false);
  const { user, isLoggedIn } = useContext(AuthContext); // Get user information from AuthContext
  const [isSuperMode, setIsSuperMode] = useState(false);
  const [timerColor, setTimerColor] = useState("text-black");
  const [profileImageFilter, setProfileImageFilter] = useState("");
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const navigate = useNavigate();

  const resetSearchState = () => {
    setIsSearchInputVisible(false);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        event &&
        event.target &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
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
      setIsHamburgerOpen(false);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSearchInput();
    // Prevent zoom on mobile devices
    document.body.style.touchAction = "manipulation";
  };

  // Hamburger button click handler
  const handleHamburgerClick = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
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
    navigate("/edit-profile");
  };

  // Super mode toggle function
  const toggleSuperMode = () => {
    setIsSuperMode(!isSuperMode);
  };

  const colors = [
    "text-red-500",
    "text-yellow-500",
    "text-green-500",
    "text-blue-500",
    "text-indigo-500",
    "text-purple-500",
    "text-pink-500",
  ];

  const colorFilters = [
    "hue-rotate(0deg)",
    "hue-rotate(60deg)",
    "hue-rotate(120deg)",
    "hue-rotate(180deg)",
    "hue-rotate(240deg)",
    "hue-rotate(300deg)",
  ];

  // Super mode effect
  useEffect(() => {
    let timerColorInterval;
    let profileFilterInterval;

    if (isSuperMode) {
      // Change timer color
      timerColorInterval = setInterval(() => {
        setTimerColor(colors[Math.floor(Math.random() * colors.length)]);
      }, 200);

      // Change profile image color filter
      profileFilterInterval = setInterval(() => {
        setProfileImageFilter(
          colorFilters[Math.floor(Math.random() * colorFilters.length)]
        );
      }, 200);
    } else {
      setTimerColor("text-black");
      setProfileImageFilter("");
    }

    return () => {
      clearInterval(timerColorInterval);
      clearInterval(profileFilterInterval);
    };
  }, [isSuperMode]);

  const handleTimeUpdate = useCallback((newTime) => {
    setRemainingTime(newTime);
  }, []);

  // 사용자 이니셜을 생성하는 함수
  const getUserInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      if (st > lastScrollTop.current) {
        // Scrolling down
        setIsNavVisible(false);
      } else {
        // Scrolling up
        setIsNavVisible(true);
      }
      lastScrollTop.current = st <= 0 ? 0 : st;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="flex-grow bg-cover bg-center bg-no-repeat pb-16"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <ScrollToTop />
        <ActivityMonitor
          onTimeUpdate={handleTimeUpdate}
          isSuperMode={isSuperMode}
          setSuperMode={setIsSuperMode}
        />
        <header>
          <nav
            className={`fixed top-0 left-0 right-0 flex items-center justify-between p-2 sm:p-3 bg-white text-black h-[50px] sm:h-[60px] font-serif z-50 shadow-sm transition-transform duration-300 ${isNavVisible ? "translate-y-0" : "-translate-y-full"
              }`}
          >
            <Link to="/" className="text-lg sm:text-xl">
              Our Journey
            </Link>
            <div className="flex items-center" ref={searchRef}>
              {isLoggedIn && user && (
                <>
                  <span
                    className={`hidden md:inline-block mr-4 text-xs sm:text-sm ${timerColor} transition-colors duration-200`}
                  >
                    Remaining login time: {formatTime(remainingTime)}
                  </span>
                  <span
                    className={`md:hidden mr-2 text-xs ${timerColor} transition-colors duration-200`}
                  >
                    {formatTimeForMobile(remainingTime)}
                  </span>
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full cursor-pointer mr-2 transition-all duration-200"
                      style={{ filter: profileImageFilter }}
                      onClick={handleProfileClick}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full cursor-pointer mr-2 flex items-center justify-center bg-indigo-600 text-white text-sm font-bold"
                      onClick={handleProfileClick}
                    >
                      {getUserInitials(user.first_name)}
                    </div>
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
                    ${isSearchInputVisible ? "w-64" : "w-0"}`}
                >
                  <form
                    onSubmit={handleSearch}
                    className={`w-64 transition-opacity duration-300 ease-out
                      ${isSearchAnimating ? "opacity-100" : "opacity-0"}`}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ElasticSearch is not yet implemented..."
                      className="w-full px-3 py-1 sm:px-4 sm:py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ fontSize: "16px" }}
                    />
                  </form>
                </div>
              </div>
              <Suspense fallback={<LoadingIndicator />}>
                <HamburgerButton
                  onClick={handleHamburgerClick}
                  isOpen={isHamburgerOpen}
                  setIsOpen={setIsHamburgerOpen}
                />
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post" element={<Post />} />
              <Route path="/post/upload" element={<PostUpload />} />
              <Route path="/scrap" element={<Scrap />} />
              <Route path="/rust-news" element={<RustNews />} />
              <Route path="/bitcoin-price" element={<BitcoinPricePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/:language/about-me" element={<AboutMe />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/github/callback" element={<OAuthCallback />} />
              <Route path="/auth/google/callback" element={<OAuthCallback />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/system-stack" element={<SystemStack />} />
              <Route path="/post/:postId" element={<SinglePostPage />} />
              <Route path="/post/new" element={<PostUpload />} />
              <Route path="/post/edit/:postId" element={<PostUpload />} />
              <Route path="/mobile-rss-viewer" element={<MobileRSSViewer />} />
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
      </div>
      <Suspense fallback={<LoadingIndicator />}>
        <Footer isSuperMode={isSuperMode} toggleSuperMode={toggleSuperMode} />
      </Suspense>
    </div>
  );
}

// App component
function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
