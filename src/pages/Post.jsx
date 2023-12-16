import React, { useState, useEffect } from "react";
import backgroundImage from "@img/background2.png";
import PostUpload from "./PostUpload";
import PostView from "./PostView";
import api from "./components/api";
import {trackPromise} from "react-promise-tracker";
import {toast} from "react-toastify";
import SearchPost from "./components/SearchPost";

function Post() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');
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
  const UploadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 10v4m0 0v4m0-4h4m-4 0H10m-4 4a4 4 0 004-4v-4a4 4 0 00-4 4z"
      />
    </svg>
  );

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setIsPostViewModalOpen(true);
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await trackPromise(api.get(`/api/posts?page=${page}`));
        setPosts(response.data.data);
        setLastPage(response.data.meta.last_page);
      } catch (error) {
        toast.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < lastPage) {
      setPage(page + 1);
    }
  };

  const handleBackClick = () => {
    setSearchResults([]); // 검색 결과를 비웁니다.
  };
  return (
    <div
      className="flex flex-col items-start h-screen text-center bg-cover bg-no-repeat pt-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {isUploadModalOpen && (
          <PostUpload setIsUploadModalOpen={setIsUploadModalOpen} postId={editingPostId} />
      )}
      {isPostViewModalOpen && (
          <PostView
              postId={selectedPostId}
              setIsPostViewModalOpen={setIsPostViewModalOpen}
              setEditingPostId={setEditingPostId}
              setIsUploadModalOpen={setIsUploadModalOpen}
          />
      )}
      <div
          className="container mx-auto px-4"
          style={{
            fontFamily: "PlayfairDisplay, serif",
          }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold cursor-pointer"
              onClick={() => window.location.reload()}>Posts</h1>
          {isLoggedIn && ( // 로그인 상태일 때만 "Upload" 버튼 렌더링
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                  onClick={handleUploadClick}
              >
                <UploadIcon className="mr-2 h-5 w-5"/>
                Upload
              </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8">
          {(searchResults.length > 0 ? searchResults : posts).length > 0 ? (
              (searchResults.length > 0 ? searchResults : posts).map((post) => (
                  <div
                      className={`rounded-lg shadow-lg overflow-hidden cursor-pointer h-54 flex flex-col justify-between ${post.hidden ? 'bg-gray-400 hover:bg-gray-600' : 'bg-white hover:bg-amber-100'}`}
                      onClick={() => handlePostClick(post.id)}
                      key={post.id}
                  >
                    <div className="p-4">
                      <h2 className="text-2xl font-bold">{post.title}</h2>
                      <div
                          className="text-gray-700 overflow-hidden overflow-ellipsis h-12"
                          dangerouslySetInnerHTML={{__html: post.content}}
                      />
                    </div>
                    <div className="px-4 py-2 flex justify-between items-end">
                      <div className="flex flex-wrap">
                        {post.tags.split(',').map((tag, index) => (
                            <span
                                className="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                                key={index}
                            >
                              #{tag.trim()}
                            </span>
                        ))}
                      </div>
                      <p>
                        {post.created_at === "0001-01-01T00:00:00Z" || post.updated_at && post.updated_at !== post.created_at
                            ? `Updated at ${new Date(post.updated_at).toLocaleString()}`
                            : `Created at ${new Date(post.created_at).toLocaleString()}`
                        }
                      </p></div>
                  </div>
              ))
          ) : (
              <p className="text-2xl text-pink-400 py-4 text-center">검색 결과가 없습니다.</p>
          )}
        </div>
        <div className="mt-8 flex justify-between">
        <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${page === 1 ? 'invisible' : ''}`}
          >
            Previous Page
          </button>
          <div className="flex space-x-2">
            {Array.from({length: 5}, (_, i) => i + 1)
                .map(i => {
                  const pageNumber = page > 3 ? page - 3 + i : i;
                  return pageNumber <= lastPage ? pageNumber : null;
                })
                .filter(Boolean)
                .map(p => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`py-2 px-4 rounded ${p === page ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-white hover:bg-gray-200 text-blue-500'}`}
                    >
                      {p}
                    </button>
                ))}
          </div>
          <button
              onClick={handleNextPage}
              disabled={page === lastPage}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${page === lastPage ? 'invisible' : ''}`}
          >
            Next Page
          </button>
        </div>
        {searchResults.length > 0 && (
            <button onClick={handleBackClick}>Back to all posts</button>
        )}
        <div className="mt-8">
          <SearchPost setSearchResults={setSearchResults}/>
        </div>
      </div>
    </div>
  );
}

export default Post;
