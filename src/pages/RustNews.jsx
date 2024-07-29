import React, { useState, useEffect } from "react";
import BitcoinPrice from "./components/BitcoinPrice";
import backgroundImage from "@img/background2.webp";
import logger from "../utils/logger";
import DOMPurify from "dompurify";
import { api2 } from "./components/api";
import { FaRegSadTear } from "react-icons/fa";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html);
};

function RustNews() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      const response = await api2.get(
        `/api/v2/hnstories?page=${page}&limit=10`
      );
      if (response.data.data.length > 0) {
        setNews((prevNews) => [...prevNews, ...response.data.data]);
        setHasMore(response.data.data.length === 10);
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
      setPage((prevPage) => prevPage + 1);
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
      className="min-h-screen bg-cover py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center my-6 text-white">
          Rust News from Hacker News
        </h1>
        <BitcoinPrice />
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
                    {item.points} points | {item.num_comments} comments
                  </p>
                  <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                    <span>Author: {item.author}</span>
                    <span>Published: {formatDate(item.created_at)}</span>
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RustNews;
