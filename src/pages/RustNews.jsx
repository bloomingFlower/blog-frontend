import React, { useState, useEffect } from "react";
import BitcoinPrice from "./components/BitcoinPrice";
import backgroundImage1 from "@img/background.webp";
import backgroundImage2 from "@img/background2.webp";
import logger from "../utils/logger";
import DOMPurify from "dompurify";
import { api2 } from "./components/api";
import { FaRegSadTear, FaBolt, FaDatabase, FaRust } from "react-icons/fa";

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html);
};

function RustNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [pagingState, setPagingState] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const backgrounds = [backgroundImage1, backgroundImage2];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api2.get("/api/v2/hnstories", {
        params: {
          page_size: 12,
          paging_state: pagingState,
        },
      });

      if (response.data.data.length > 0) {
        setNews((prevNews) => [...prevNews, ...response.data.data]);
        setHasMore(!!response.data.next_paging_state);
        setPagingState(response.data.next_paging_state);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    } catch (error) {
      logger.error("Failed to fetch Rust news:", error);
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchNews();
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
      className="min-h-screen bg-cover py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out"
      style={{ backgroundImage: `url(${backgrounds[backgroundIndex]})` }}
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
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
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
            ))}
          </div>
        ) : (
          <NoNewsFound />
        )}
        {hasMore && news.length > 0 && (
          <div className="flex justify-center mt-8">
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
      </div>
    </div>
  );
}

export default RustNews;
