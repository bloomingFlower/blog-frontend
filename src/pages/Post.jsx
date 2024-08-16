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
import DOMPurify from 'dompurify';
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const removeImageTags = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('img').forEach(img => img.remove());
  return doc.body.innerHTML;
};

const extractMainContent = (content, maxLength = 200) => {
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  try {
    let plainText = '';

    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent && parsedContent.root && parsedContent.root.children) {
        plainText = parsedContent.root.children
          .map(node => {
            if (node.type === 'paragraph') {
              return node.children.map(child => child.text).join(' ');
            }
            return '';
          })
          .filter(text => text.trim() !== '') // Remove empty paragraphs
          .join('\n'); // Separate paragraphs with line breaks
      }
    } catch (jsonError) {
      plainText = stripHtml(removeImageTags(content));
    }

    const decodedText = DOMPurify.sanitize(plainText, { ALLOWED_TAGS: [] });

    // Handle truncation if the text exceeds the maximum length
    if (decodedText.length > maxLength) {
      const truncated = decodedText.slice(0, maxLength);
      // Keep only the text after the last line break
      const lastNewLineIndex = truncated.lastIndexOf('\n');
      return lastNewLineIndex !== -1
        ? truncated.slice(0, lastNewLineIndex) + '...'
        : truncated + '...';
    }

    return decodedText;
  } catch (error) {
    console.error('Failed to parse content:', error);
    return 'Content parsing error';
  }
};

const PostItem = memo(({ post, isNew, isRecent, isUpdated, isUserPost, readingTime, loadingPostId }) => {
  return (
    <Link
      to={`/post/${post.id}`}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 flex flex-col h-80 sm:h-96 w-full
        ${isNew ? "ring-2 ring-green-500" : ""}
        ${post.hidden ? "opacity-50 bg-gray-100" : ""}
        ${loadingPostId === post.id ? "relative" : ""}`}
      style={{ touchAction: 'manipulation' }}
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
        <div className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-3 sm:line-clamp-5 flex-grow overflow-hidden whitespace-pre-line">
          {extractMainContent(post.content)}
        </div>
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
    </Link>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.isNew === nextProps.isNew &&
    prevProps.isRecent === nextProps.isRecent &&
    prevProps.isUpdated === nextProps.isUpdated &&
    prevProps.isUserPost === nextProps.isUserPost &&
    prevProps.readingTime === nextProps.readingTime
  );
});

function Post() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isPostViewModalOpen, setIsPostViewModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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

  const handleUploadClick = (e) => {
    e.stopPropagation();
    setEditingPostId(null);
    navigate('/post/upload');
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => { }, [isUploadModalOpen]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setPage(1);
    fetchPosts(1, category);
  }, []);

  const fetchPosts = useCallback(async (pageNum, category = selectedCategory) => {
    setIsLoading(true);
    try {
      const response = await trackPromise(
        api.get(`/api/v1/posts?page=${pageNum}&category=${category === "All" ? "" : category}`)
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
  }, [selectedCategory]);

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
  }, [fetchPosts, selectedCategory]);

  const [isPostStatusChanged, setIsPostStatusChanged] = useState(false);

  const refreshPosts = useCallback(() => {
    fetchPosts(page);
    setIsPostStatusChanged(false);
  }, [fetchPosts, page]);

  const isNewPost = (createdAt) => {
    return new Date(createdAt) > new Date(Date.now() - 10 * 60 * 1000);
  };

  const isRecentPost = (createdAt) => {
    return new Date(createdAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  };

  const isRecentlyUpdated = (updatedAt, createdAt) => {
    const updateTime = new Date(updatedAt);
    const createTime = new Date(createdAt);
    return (
      updateTime > createTime &&
      updateTime > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
  };

  useEffect(() => {
    const userDataString = sessionStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setCurrentUserId(userData.first_name + "#" + userData.id);
    }
  }, [isLoggedIn]);

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
      role="button"
      style={{ touchAction: "manipulation" }}
    >
      <FaRss className="text-sm sm:mr-1" />
      <span className="hidden sm:inline text-sm">RSS</span>
    </button>
  );

  const navigate = useNavigate();

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
          <div className="max-w-7xl mx-auto">
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
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${selectedCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  style={{ touchAction: 'manipulation' }}
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
                    <PostItem
                      key={post.id}
                      post={post}
                      isNew={isNew}
                      isRecent={isRecent}
                      isUpdated={isUpdated}
                      isUserPost={isUserPost}
                      readingTime={readingTime}
                      loadingPostId={loadingPostId}
                    />
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

export default memo(Post);
