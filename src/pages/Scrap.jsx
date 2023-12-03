import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "@img/background2.png";
import PostUpload from "./PostUpload";

function Scrap() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn') === 'true');
  const posts = [
    { title: "Post 1", content: "This is the first post." },
    { title: "Post 2", content: "This is the second post." },
    // ...
  ];
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
  const navigate = useNavigate();

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div
      className="flex flex-col items-start h-screen text-center bg-cover bg-no-repeat pt-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {isUploadModalOpen && (
          <PostUpload setIsUploadModalOpen={setIsUploadModalOpen} />
      )}
      <div
        className="container mx-auto px-4"
        style={{
          fontFamily: "PlayfairDisplay, serif",
        }}
      >

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Scrap</h1>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post, index) => (
              <Link to={`/post/${index}`} key={index}> {/* 포스트를 클릭 가능한 링크로 만듭니다 */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4">
                    <h2 className="text-2xl font-bold">{post.title}</h2>
                    <p className="text-gray-700">{post.content}</p>
                  </div>
                </div>
              </Link>
          ))}
        </div>
        <div className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="mt-2 px-3 py-2 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
          />
        </div>
      </div>
    </div>
  );
}

export default Scrap;
