// PostUpload.jsx
import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";

function PostUpload({ setIsUploadModalOpen }) {
    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState("");
    const [isModified, setIsModified] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleUpload = () => {
        // 여기에 업로드 기능을 구현합니다.
    };

    const handleInputChange = (e, setInput) => {
        setIsModified(true);
        setInput(e.target.value);
    };

    const handleClose = () => {
        if (isModified) {
            setIsConfirmModalOpen(true);
        } else {
            setIsUploadModalOpen(false);
        }
    };

    useEffect(() => {
        Modal.setAppElement("#root");
    }, []);

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
                <ReactQuill value={editorState} onChange={setEditorState} />
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
            Closed
          </button>
        </div>
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={() => setIsConfirmModalOpen(false)}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              borderRadius: "4px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Are you sure you want to close?
          </h2>
          <div>
            <button
              style={{
                marginRight: "10px",
                padding: "10px 20px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
              onClick={() => setIsUploadModalOpen(false)}
            >
              Yes
            </button>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
              onClick={() => setIsConfirmModalOpen(false)}
            >
              No
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default PostUpload;
