import React, { useState, useEffect } from "react";
import { ApiServiceClient } from "../../protos/ApiServiceClientPb";
import { GetPostsForUserRequest } from "../../protos/api_pb";
import backgroundImage from "@img/background2.webp";
import logger from "../utils/logger";
import DOMPurify from "dompurify";
import he from "he";
import LoadingIndicator from "./components/LoadingIndicator";
import { FaRegSadTear } from "react-icons/fa";

const formatDate = (seconds) => {
  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sanitizeHTML = (html) => {
  // Decode HTML entities before sanitizing
  const decodedHtml = he.decode(html);
  return DOMPurify.sanitize(decodedHtml);
};

const truncateDescription = (description, maxLength = 150) => {
  if (description.length <= maxLength) return description;
  return `${description.substring(0, maxLength)}...`;
};

const NoBookmarksFound = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-white bg-opacity-80 rounded-lg shadow-md p-8">
    <FaRegSadTear className="text-6xl text-gray-400 mb-4" />
    <h2 className="text-2xl font-bold text-gray-700 mb-2">
      No bookmarks found
    </h2>
    <p className="text-gray-500 text-center mb-4">
      You haven't bookmarked any articles yet. Start exploring and save
      interesting articles!
    </p>
  </div>
);

function Scrap() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getGrpcApiUrl = () => {
    if (process.env.NODE_ENV === "development") {
      return process.env.REACT_GRPC_API_URL;
    }
    return window.ENV.REACT_GRPC_API_URL !== "%REACT_GRPC_API_URL%"
      ? window.ENV.REACT_GRPC_API_URL
      : "";
  };

  const getGrpcApiKey = () => {
    if (process.env.NODE_ENV === "development") {
      return process.env.GRPC_API_KEY;
    }
    return window.ENV.GRPC_API_KEY !== "%GRPC_API_KEY%"
      ? window.ENV.GRPC_API_KEY
      : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new ApiServiceClient(getGrpcApiUrl(), null, {
          withCredentials: true,
        });
        const request = new GetPostsForUserRequest();
        request.setUserid("ba1af24d-9bfc-4f40-8c9c-9c1ea87b69fa");
        request.setLimit("12");

        const metadata = {
          "Content-Type": "application/grpc-web+proto",
          "X-Grpc-Web": "1",
          api_key: getGrpcApiKey(),
        };

        const stream = client.handlerGetPostsForUser(request, metadata);
        const receivedPosts = [];

        stream.on("data", (response) => {
          receivedPosts.push(response.toObject());
        });

        stream.on("status", (status) => {
          logger.debug("Stream status:", status);
        });

        stream.on("end", () => {
          // logger.info(
          //   `Stream ended. Total posts received: ${receivedPosts.length}`
          // );
          setPosts(receivedPosts);
          setIsLoading(false);
        });

        stream.on("error", (err) => {
          logger.error("Stream error:", err);
          setIsLoading(false);
        });
      } catch (error) {
        logger.error("Failed to fetch data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover py-8 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
            Bookmarked Articles
          </h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingIndicator />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition duration-300">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {post.title}
                    </a>
                  </h2>
                  <p
                    className="text-sm sm:text-base text-gray-600 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(
                        truncateDescription(post.description)
                      ),
                    }}
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-gray-500">
                    <span className="mb-1 sm:mb-0">
                      Published: {formatDate(post.publishedat.seconds)}
                    </span>
                    <span>
                      Last updated: {formatDate(post.updatedat.seconds)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoBookmarksFound />
        )}
      </div>
    </div>
  );
}

export default Scrap;
