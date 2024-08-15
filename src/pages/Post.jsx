import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import backgroundImage from "@img/background2.webp";
import PostUpload from "./PostUpload";
import PostView from "./PostView";
import { api } from "./components/api";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import SearchPost from "./components/SearchPost";
import LoadingIndicator from "./components/LoadingIndicator";
import {
  FaRegSadTear,
  FaServer,
  FaUser,
  FaEdit,
  FaEyeSlash,
  FaPaperclip,
  FaFolder,
  FaRss,
} from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import { calculateReadingTime } from "../utils/readingTime.js";
import { FaClock } from "react-icons/fa";
import { categoryOptions } from "../constants/categories";

function Post() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [currentUserId, setCurrentUserId] = useState(null);
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
  const [showCreatePostHint, setShowCreatePostHint] = useState(false);
  const hintRef = useRef(null);
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

  const [loadingPostId, setLoadingPostId] = useState(null);

  const handlePostClick = (postId) => {
    setLoadingPostId(postId);
    setSelectedPostId(postId);
    setIsPostViewModalOpen(true);
  };

  const handleUploadClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setEditingPostId(null); // Set editingPostId to null when creating a new post
    setIsUploadModalOpen(true);
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {}, [isUploadModalOpen]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setPage(1);
    fetchPosts(1, category);
  }, []);

  const fetchPosts = useCallback(
    async (pageNum, category = selectedCategory) => {
      setIsLoading(true);
      try {
        const response = await trackPromise(
          api.get(
            `/api/v1/posts?page=${pageNum}&category=${
              category === "All" ? "" : category
            }`
          )
        );
        setPosts(response.data.data);
        setLastPage(response.data.meta.last_page);
        setPage(pageNum);
      } catch (error) {
        console.error(`Error fetching posts for page ${pageNum}:`, error);
        toast.error("게시물을 가져오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory]
  );

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
              className={`w-8 h-8 rounded-full ${
                pageNumber === page
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
  }, [fetchPosts, selectedCategory]);

  const [isPostStatusChanged, setIsPostStatusChanged] = useState(false);

  const refreshPosts = useCallback(() => {
    fetchPosts(page);
    setIsPostStatusChanged(false);
  }, [fetchPosts, page]);

  const isNewPost = (createdAt) => {
    return new Date(createdAt) > new Date(Date.now() - 10 * 60 * 1000); // 10 minutes
  };

  const isRecentPost = (createdAt) => {
    return new Date(createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days
  };

  const isRecentlyUpdated = (updatedAt, createdAt) => {
    const updateTime = new Date(updatedAt);
    const createTime = new Date(createdAt);
    return (
      updateTime > createTime &&
      updateTime > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ); // 1 day
  };

  useEffect(() => {
    // Get user information from session storage
    const userDataString = sessionStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setCurrentUserId(userData.first_name + "#" + userData.id);
    }
  }, [isLoggedIn]);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    let filtered = (searchResults.length > 0 ? searchResults : posts).filter(
      (post) => {
        if (!post.hidden) return true;
        return post.user.first_name + "#" + post.user.id === currentUserId;
      }
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (post) => (post.category || "Uncategorized") === selectedCategory
      );
    }

    return filtered;
  }, [searchResults, posts, currentUserId, selectedCategory]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowCreatePostHint(true);

      const timer = setTimeout(() => {
        setShowCreatePostHint(false);
      }, 3700);

      const handleClickOutside = (event) => {
        if (hintRef.current && !hintRef.current.contains(event.target)) {
          setShowCreatePostHint(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isLoggedIn]);

  const handleRSSClick = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await api.get("/api/v1/rss", {
        responseType: "text",
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml",
        },
      });
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");

      const xmlString = new XMLSerializer().serializeToString(xmlDoc);

      const blob = new Blob([xmlString], {
        type: "application/xml;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to fetch RSS feed. Please try again later.");
    }
  }, []);

  const RSSButton = () => (
    <button
      onClick={handleRSSClick}
      className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-2 py-1 rounded-full flex items-center transition-colors duration-300 touch-manipulation"
      title="RSS Feed"
    >
      <FaRss className="text-sm sm:mr-1" />
      <span className="hidden sm:inline text-sm">RSS</span>
    </button>
  );

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
              refreshPosts={refreshPosts}
            />
          )}
          {isPostViewModalOpen && (
            <PostView
              postId={selectedPostId}
              setIsPostViewModalOpen={setIsPostViewModalOpen}
              setEditingPostId={setEditingPostId}
              setIsUploadModalOpen={setIsUploadModalOpen}
              refreshPosts={refreshPosts}
              setIsPostStatusChanged={setIsPostStatusChanged}
              setLoadingPostId={setLoadingPostId}
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl sm:text-3xl font-bold text-white">
                Go-Powered RESTful Post Management System
              </h1>
              <RSSButton />
            </div>
            <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <FaServer className="text-green-500 mr-2" />
                <FaGolang className="text-blue-500 mr-2" />
              </div>
              <p className="text-sm text-gray-700 text-center">
                This robust post management system is built with Go,
                implementing RESTful APIs for seamless CRUD operations and
                efficient data handling.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
              <div className="w-full mb-4 sm:mb-0 sm:mr-4">
                <SearchPost setSearchResults={setSearchResults} />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {isLoggedIn && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <button
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center transition duration-300"
                    aria-label="Upload"
                    onClick={handleUploadClick}
                  >
                    <UploadIcon />
                  </button>
                  {showCreatePostHint && (
                    <aside
                      ref={hintRef}
                      className="absolute -top-5 right-0 transform translate-x-1/4 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-xs font-semibold shadow-sm z-10 whitespace-nowrap animate-pulse"
                    >
                      Create a new!
                    </aside>
                  )}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingIndicator />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => {
                  const isNew = isNewPost(post.created_at);
                  const isRecent = isRecentPost(post.created_at);
                  const isUpdated = isRecentlyUpdated(
                    post.updated_at,
                    post.created_at
                  );
                  const isUserPost =
                    post.user.first_name + "#" + post.user.id === currentUserId;
                  const readingTime = calculateReadingTime(post.content);

                  return (
                    <div
                      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 flex flex-col h-80 sm:h-96 w-full
                        ${isNew ? "ring-2 ring-green-500" : ""}
                        ${post.hidden ? "opacity-50 bg-gray-100" : ""}
                        ${loadingPostId === post.id ? "relative" : ""}`}
                      onClick={() => handlePostClick(post.id)}
                      key={post.id}
                    >
                      {loadingPostId === post.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                          <ClipLoader color="#4A90E2" size={50} />
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="mb-2">
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {post.title}
                          </h2>
                          <p className="text-xs text-gray-600 flex items-center">
                            <FaUser className="mr-1 text-gray-400" />
                            <span className="font-medium">
                              {post.user.first_name}
                            </span>
                            <span className="ml-1 bg-gray-200 text-gray-700 px-1 rounded">
                              #{post.user.id}
                            </span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {isRecent && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded inline-flex items-center">
                              New
                            </span>
                          )}
                          {isUpdated && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded inline-flex items-center">
                              <FaEdit className="mr-1" />
                              Updated
                            </span>
                          )}
                          {isUserPost && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded inline-flex items-center">
                              My Post
                            </span>
                          )}
                          {post.hidden && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded inline-flex items-center">
                              <FaEyeSlash className="mr-1" />
                              Hidden
                            </span>
                          )}
                          {post.file && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-flex items-center">
                              <FaPaperclip className="mr-1" />
                              File
                            </span>
                          )}
                          {post.category && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded inline-flex items-center">
                              <FaFolder className="mr-1" />
                              {post.category}
                            </span>
                          )}
                        </div>
                        <div
                          className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 sm:line-clamp-3 flex-grow overflow-hidden"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                          onClick={(e) => e.preventDefault()}
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
                            className="w-full h-24 sm:h-32 object-cover mb-2"
                          />
                        )}
                        {post.tags && post.tags.trim() !== "" && (
                          <div className="flex flex-wrap gap-1 mb-2 overflow-hidden h-6">
                            {post.tags
                              .split(",")
                              .slice(0, 3)
                              .map((tag, index) => (
                                <span
                                  className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded"
                                  key={index}
                                >
                                  #{tag.trim()}
                                </span>
                              ))}
                            {post.tags.split(",").length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.split(",").length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                        <p className="flex items-center">
                          <FaClock className="mr-1" />
                          {readingTime} min read
                        </p>
                        <p>
                          {post.created_at === "0001-01-01T00:00:00Z" ||
                          (post.updated_at &&
                            post.updated_at !== post.created_at)
                            ? `Updated ${new Date(
                                post.updated_at
                              ).toLocaleDateString()}`
                            : `Created ${new Date(
                                post.created_at
                              ).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
