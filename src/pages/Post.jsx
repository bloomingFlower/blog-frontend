import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@img/background2.png";
import PostUpload from "./PostUpload";
function Post() {
  const [search, setSearch] = useState("");
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
          <h1 className="text-4xl font-bold">Posts</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={handleUploadClick}
          >
            <UploadIcon className="mr-2 h-5 w-5" />
            Upload
          </button>

        </div>
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post, index) => (
            <div
              key={index}
              className="card bg-white rounded-lg shadow-md overflow-hidden m-3"
            >
              <div className="p-6">
                <h2 className="block mt-1 text-2xl leading-tight font-medium text-black">
                  {post.title}
                </h2>
                <p className="mt-2 text-gray-500">{post.content}</p>
              </div>
            </div>
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

export default Post;
