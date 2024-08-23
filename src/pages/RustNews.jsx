import React, { useState, useEffect, useRef } from "react";
import BitcoinPrice from "./components/BitcoinPrice";
import backgroundImage1 from "@img/background.webp";
import backgroundImage2 from "@img/background2.webp";
import logger from "../utils/logger";
import DOMPurify from "dompurify";
import { api2 } from "./components/api";
import {
  FaRegSadTear,
  FaBolt,
  FaDatabase,
  FaRust,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html);
};

const AnimatedCard = React.forwardRef(({ item, index }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        if (ref) ref.current = node;
      }}
      className={`bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition duration-300">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {item.title}
          </a>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {item.points} points
        </p>
        {item.story_text && (
          <div
            className="text-sm text-gray-700 mb-4 overflow-hidden"
            style={{ maxHeight: "100px" }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(item.story_text),
            }}
          />
        )}
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <span>Author: {item.author}</span>
        </div>
      </div>
    </div>
  );
});

function RustNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [pagingState, setPagingState] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState({
    top: false,
    bottom: false,
  });
  const [easterEggPattern, setEasterEggPattern] = useState([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const danceIntervalRef = useRef(null);
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const firstNewItemRef = useRef(null);

  const backgrounds = [backgroundImage1, backgroundImage2];

  useEffect(() => {
    fetchNews(false);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (firstNewItemRef.current && newItemsCount > 0 && isLoadingMore) {
      const navHeight = 60; // nav bar height (mobile: 50px, desktop: 60px)
      const yOffset =
        firstNewItemRef.current.getBoundingClientRect().top +
        window.scrollY -
        navHeight;

      window.scrollTo({
        top: yOffset,
        behavior: "smooth",
      });

      // Reset states after scrolling
      setNewItemsCount(0);
      setIsLoadingMore(false);
    }
  }, [newItemsCount, isLoadingMore]);

  useEffect(() => {
    if (!showEasterEgg) {
      setEasterEggPattern([]);
    }
  }, [showEasterEgg]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    setShowScrollButtons({
      top: scrollY > 300,
      bottom: scrollY < 300 && pageHeight > 300,
    });
  };

  const handleScrollButtonClick = (direction) => {
    const newPattern = [...easterEggPattern, direction].slice(-4);
    setEasterEggPattern(newPattern);

    if (newPattern.join('') === 'topbottomtopbottom') {
      activateEasterEgg();
    }

    if (direction === 'top') {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  };

  const activateEasterEgg = () => {
    setShowEasterEgg(true);
    setEasterEggPattern([]);
    startDanceScroll();
    setTimeout(() => {
      setShowEasterEgg(false);
      stopDanceScroll();
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const startDanceScroll = () => {
    if (danceIntervalRef.current) return;

    let direction = 1;
    const scrollAmount = 50;
    const interval = 200;

    danceIntervalRef.current = setInterval(() => {
      window.scrollBy(0, direction * scrollAmount);
      direction *= -1;
    }, interval);
  };

  const stopDanceScroll = () => {
    if (danceIntervalRef.current) {
      clearInterval(danceIntervalRef.current);
      danceIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopDanceScroll();
  }, []);

  const fetchNews = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const response = await api2.get("/api/v2/hnstories", {
        params: {
          page_size: 12,
          paging_state: pagingState,
        },
      });

      if (response.data.data.length > 0) {
        setNews((prevNews) => [...prevNews, ...response.data.data]);
        if (loadMore) {
          setNewItemsCount(response.data.data.length);
        }
        setHasMore(!!response.data.next_paging_state);
        setPagingState(response.data.next_paging_state);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      logger.error("Failed to fetch Rust news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setIsLoadingMore(true);
      fetchNews(true);
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }
  };

  const NoNewsFound = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-white bg-opacity-80 rounded-lg shadow-md p-8">
      <FaRegSadTear className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">
        No Rust news found
      </h2>
      <p className="text-gray-500 text-center">
        We couldn't find any Rust news at the moment. Please check back later.
      </p>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat py-8 px-4 sm:px-6 lg:px-8 pb-24 transition-all duration-500 ease-in-out ${showEasterEgg
        ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        : ""
        }`}
      style={
        showEasterEgg
          ? {}
          : {
            backgroundImage: `url(${backgrounds[backgroundIndex]})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover'
          }
      }
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center my-6 text-white">
          Rust-Powered News Aggregator
        </h1>
        <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <FaRust className="text-orange-500 mr-2" />
            <FaBolt className="text-yellow-500 mr-2" />
            <FaDatabase className="text-blue-500 mr-2" />
          </div>
          <p className="text-sm text-gray-700 text-center">
            This high-performance news aggregator is built with Rust, utilizing
            REST APIs for data retrieval, Apache Kafka for real-time event
            streaming, ScyllaDB for scalable storage, and Redis for
            lightning-fast caching.
          </p>
        </div>
        <BitcoinPrice />
        <div className="mb-6"></div>
        {isLoading && news.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <AnimatedCard
                key={item.id}
                item={item}
                ref={index === news.length - newItemsCount ? firstNewItemRef : null}
              />
            ))}
          </div>
        ) : (
          <NoNewsFound />
        )}
        {hasMore && news.length > 0 && (
          <div className="flex justify-center mt-8 mb-12">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 animate-pulse"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Load More Rust News"
              )}
            </button>
          </div>
        )}
        <div className="fixed bottom-20 right-4 sm:right-8 flex flex-col space-y-2 z-50">
          {showScrollButtons.top && (
            <button
              onClick={() => handleScrollButtonClick("top")}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none opacity-60 hover:opacity-100"
              aria-label="Scroll to top"
            >
              <FaArrowUp className="text-sm" />
            </button>
          )}

          {showScrollButtons.bottom && (
            <button
              onClick={() => handleScrollButtonClick("bottom")}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none opacity-60 hover:opacity-100"
              aria-label="Scroll to bottom"
            >
              <FaArrowDown className="text-sm" />
            </button>
          )}
        </div>

        {showEasterEgg && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-center z-50">
            <p className="text-xl font-bold text-purple-600">
              Yay! You found an easter egg!
            </p>
            <p className="text-gray-600">Let's dance up and down...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RustNews;