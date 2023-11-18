// PostUpload.jsx
import React, { useState, useEffect } from "react";

function PostUpload({ setIsUploadModalOpen }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState("");
  const [isModified, setIsModified] = useState(false);

  const handleUpload = () => {
    // 여기에 업로드 기능을 구현합니다.
  };

  const handleInputChange = (e, setInput) => {
    setIsModified(true);
    setInput(e.target.value);
  };

  const handleClose = () => {
    if (isModified) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        setIsUploadModalOpen(false);
      }
    } else {
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl m-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Upload a Post</h2>
        <input
          className="border border-gray-300 p-2 w-full mb-4"
          type="text"
          value={title}
          onChange={(e) => handleInputChange(e, setTitle)}
          placeholder="Title"
        />
        <textarea
          className="border border-gray-300 p-2 w-full mb-4 h-64"
          value={content}
          onChange={(e) => handleInputChange(e, setContent)}
          placeholder="Content"
        />
        <input
          className="border border-gray-300 p-2 w-full mb-4"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input
          className="border border-gray-300 p-2 w-full mb-4"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
        <div className="flex justify-end space-x-4">
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleUpload}
          >
            Upload
          </button>
          <button
            className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostUpload;
