import React, { useState, useEffect, useCallback, useMemo } from "react";
import backgroundImage from "@img/background2.webp";
import PostUpload from "./PostUpload";
import PostView from "./PostView";
import { api } from "./components/api";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import SearchPost from "./components/SearchPost";
import LoadingIndicator from "./components/LoadingIndicator";
import { FaRegSadTear, FaServer } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";


function Post() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [isPostViewModalOpen, setIsPostViewModalOpen] = useState(false);
  // PostUpload 모달의 열림/닫힘을 제어하는 상태를 추가
  // 편집 중인 포스트의 ID를 저장하는 상태를 추가
  const [editingPostId, setEditingPostId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [posts, setPosts] = useState([]);
  // 검색 결과를 저장할 상태를 추가
  const [searchResults, setSearchResults] = useState([]);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const UploadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="w-4 h-4 sm:w-5 sm:h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setIsPostViewModalOpen(true);
  };

  const handleUploadClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsUploadModalOpen((prev) => {
      return !prev;
    });
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => { }, [isUploadModalOpen]);

  const fetchPosts = useCallback(async (pageNum) => {
    setIsLoading(true);
    try {
      const response = await trackPromise(
        api.get(`/api/v1/posts?page=${pageNum}`)
      );
      setPosts(response.data.data);
      setLastPage(response.data.meta.last_page);
      setPage(pageNum);
    } catch (error) {
      console.error(`Error fetching posts for page ${pageNum}:`, error);
      toast.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= lastPage && !isLoading) {
        fetchPosts(newPage);
      }
    },
    [fetchPosts, lastPage, isLoading]
  );

  const handlePrevPage = useCallback(() => {
    handlePageChange(page - 1);
  }, [handlePageChange, page]);

  const handleNextPage = useCallback(() => {
    handlePageChange(page + 1);
  }, [handlePageChange, page]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          handlePrevPage();
          break;
        case "ArrowRight":
          handleNextPage();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [page, lastPage]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleBackClick = () => {
    setSearchResults([]);
  };

  const NoPostsFound = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-white bg-opacity-80 rounded-lg shadow-md p-8">
      <FaRegSadTear className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-2xl font-bold text-gray-700 mb-2">No posts found</h2>
      <p className="text-gray-500 text-center mb-4">
        No posts are currently displayed. Please write a new post or check back
        later.
      </p>
      {isLoggedIn && (
        <button
          onClick={handleUploadClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create New Post
        </button>
      )}
    </div>
  );

  const Pagination = useMemo(() => {
    return (
      <div className="mt-8 mb-16 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isLoading}
          className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
          const pageNumber = page > 3 && lastPage > 5 ? page - 2 + i : i + 1;
          return pageNumber <= lastPage ? (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={isLoading}
              className={`w-8 h-8 rounded-full ${pageNumber === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {pageNumber}
            </button>
          ) : null;
        })}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === lastPage || isLoading}
          className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }, [page, lastPage, isLoading, handlePageChange]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div
          className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {isUploadModalOpen && (
            <PostUpload
              setIsUploadModalOpen={setIsUploadModalOpen}
              postId={editingPostId}
            />
          )}
          {isPostViewModalOpen && (
            <PostView
              postId={selectedPostId}
              setIsPostViewModalOpen={setIsPostViewModalOpen}
              setEditingPostId={setEditingPostId}
              setIsUploadModalOpen={setIsUploadModalOpen}
            />
          )}
          <div className="max-w-7xl mx-auto">
            {imageLoadError && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 text-sm">
                <p>
                  Some images may not display correctly. Please refresh the page
                  if you encounter any issues.
                </p>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-center my-6 text-white">
              Go-Powered RESTful Post Management System
            </h1>
            <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <FaServer className="text-green-500 mr-2" />
                <FaGolang className="text-blue-500 mr-2" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                This robust post management system is built with Go, implementing RESTful APIs for seamless CRUD operations and efficient data handling.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div className="w-full mb-4 sm:mb-0 sm:mr-4">
                <SearchPost setSearchResults={setSearchResults} />
              </div>
              {isLoggedIn && (
                <button
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center transition duration-300"
                  aria-label="Upload"
                  onClick={handleUploadClick}
                >
                  <UploadIcon />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingIndicator />
              </div>
            ) : (searchResults.length > 0 ? searchResults : posts).length >
              0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(searchResults.length > 0 ? searchResults : posts).map(
                  (post) => (
                    <div
                      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${post.hidden ? "opacity-50" : ""
                        }`}
                      onClick={() => handlePostClick(post.id)}
                      key={post.id}
                    >
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h2>
                        <div
                          className="text-gray-600 text-sm mb-4 line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `${process.env.REACT_APP_API_URL}${post.image}`;
                              setImageLoadError(true);
                            }}
                            className="w-full h-48 object-cover mb-4"
                          />
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.split(",").map((tag, index) => (
                            <span
                              className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                              key={index}
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {post.created_at === "0001-01-01T00:00:00Z" ||
                            (post.updated_at &&
                              post.updated_at !== post.created_at)
                            ? `Updated at ${new Date(
                              post.updated_at
                            ).toLocaleString()}`
                            : `Created at ${new Date(
                              post.created_at
                            ).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <NoPostsFound />
            )}

            {Pagination}

            {searchResults.length > 0 && (
              <button
                onClick={handleBackClick}
                className="mt-4 w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                aria-label="Back to all posts"
              >
                Back to all posts
              </button>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Footer content */}
        </div>
      </footer>
    </div>
  );
}

export default Post;