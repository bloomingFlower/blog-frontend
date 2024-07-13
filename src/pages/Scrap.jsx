import React, { useState, useEffect } from "react";
import { ApiServiceClient } from "../../protos/ApiServiceClientPb";
import { GetPostsForUserRequest } from "../../protos/api_pb";
import backgroundImage from "@img/background2.png";
import logger from "../utils/logger";
import DOMPurify from "dompurify";

const formatDate = (seconds) => {
  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function Scrap() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sanitizeHTML = (html) => {
    return DOMPurify.sanitize(html);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new ApiServiceClient(
          `${process.env.REACT_GRPC_API_URL}`,
          null,
          {
            withCredentials: true,
          }
        );
        const request = new GetPostsForUserRequest();
        request.setUserid("ba1af24d-9bfc-4f40-8c9c-9c1ea87b69fa");
        request.setLimit("10");

        const metadata = {
          "Content-Type": "application/grpc-web+proto",
          "X-Grpc-Web": "1",
          api_key: `${process.env.GRPC_API_KEY}`,
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
          logger.info(
            `Stream ended. Total posts received: ${receivedPosts.length}`
          );
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
      className="min-h-screen bg-cover py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center my-6 text-white">
          Bookmarked Articles
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition duration-300">
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
                    className="text-gray-600 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(
                        post.description.length > 150
                          ? `${post.description.substring(0, 150)}...`
                          : post.description
                      ),
                    }}
                  />
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
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
          <p className="text-xl text-white text-center">
            No bookmarked articles found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Scrap;
