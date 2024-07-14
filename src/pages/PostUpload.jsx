// PostUpload.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import CreatableSelect from "react-select/creatable";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import api from "./components/api";
import { trackPromise } from "react-promise-tracker";
import sanitizeHtml from "sanitize-html";
import { toast } from "react-toastify";

Quill.register("modules/imageUploader", ImageUploader);

function PostUpload({ setIsUploadModalOpen, postId }) {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const quillRef = useRef(); // Quill 인스턴스에 접근하기 위한 ref
  // TODO : 이미지 리사이즈, 압축 기능 구현
  const modules = useMemo(() => {
    return {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
        [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ], // outdent/indent
        ["link", "image", "video"],
        ["clean"],
      ],
      imageUploader: {
        upload: (file) => {
          try {
            return new Promise((resolve, reject) => {
              if (!file) {
                toast.error("No file selected");
                return;
              }
              const formData = new FormData();
              formData.append("image", file);
              api({
                url: `${process.env.REACT_APP_API_URL}/api/upload-img`,
                method: "POST",
                data: formData,
                withCredentials: true,
              })
                .then((response) => {
                  resolve(response.data.url);
                })
                .catch((error) => {
                  reject("Upload failed");
                });
            });
          } catch (error) {
            toast("Error in imageUploader:", error);
          }
        },
      },
    };
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await trackPromise(api.get(`/api/post/${postId}`));
        if (response.data.data) {
          setTitle(response.data.data.title);
          setEditorState(response.data.data.content);
          setTags(
            response.data.data.tags
              .split(",")
              .map((tag) => ({ value: tag, label: tag })) || []
          );
          setFile(response.data.data.file);
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    // title과 content가 비어있는지 확인
    if (!title.trim() || !editorState.trim()) {
      toast.error("Title or content cannot be empty");
      return;
    }

    // HTML Sanitization
    const cleanContent = sanitizeHtml(editorState, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "p",
        "b",
        "i",
        "u",
        "s",
        "a",
        "br",
        "video",
      ]),
      allowedAttributes: {
        a: ["href", "target"],
        img: ["src", "alt"],
        video: [
          "src",
          "controls",
          "autoplay",
          "muted",
          "loop",
          "width",
          "height",
        ],
      },
    });
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", cleanContent);
    const tagValues = tags.map((tag) => tag.value).join(",");
    console.log("tags", tagValues);
    formData.append("tags", tagValues);
    if (file) {
      formData.append("file", file);
    }
    try {
      if (postId) {
        // If postId is provided, update the existing post
        const response = await trackPromise(
          api.put(`/api/post/${postId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        );
        if (response.status === 200) {
          toast.success("Post updated successfully");
          setIsUploadModalOpen(false);
          window.location.reload();
        } else {
          alert("Failed to upload post");
        }
      } else {
        const response = await trackPromise(
          api.post("/api/posts", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        );

        if (response.status === 200) {
          toast.success("Post uploaded successfully");
          setIsUploadModalOpen(false);
          window.location.reload();
        } else {
          alert("Failed to upload post");
        }
      }
    } catch (error) {
      toast.error("Failed to upload post:", error);
    }
  };

  const handleInputChange = (content) => {
    setIsModified(true);
    setEditorState(content);
  };

  const handleInputTag = (newValue, actionMeta) => {
    if (actionMeta.action === "remove-value") {
      setTags(newValue);
    } else if (actionMeta.action === "create-option") {
      setTags([...tags, newValue[newValue.length - 1]]);
    }
  };

  const handleClose = () => {
    if (isModified) {
      setIsConfirmModalOpen(true);
    } else {
      setIsUploadModalOpen(false);
    }
  };
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
    Modal.setAppElement("#root");
  }, []);

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => setIsUploadModalOpen(false)}
      contentLabel="Post Upload"
      className="w-11/12 max-w-4xl mx-auto my-4 sm:my-10 bg-white rounded-lg shadow-xl overflow-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      style={{
        content: {
          maxHeight: "90vh",
        },
      }}
    >
      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          {postId ? "Edit Post" : "Upload a Post"}
        </h2>
        <input
          ref={titleRef}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
        />
        <div className="mb-4">
          <ReactQuill
            ref={quillRef}
            value={editorState}
            onChange={setEditorState || handleInputChange}
            modules={modules}
            theme="snow"
            placeholder="내용을 입력해주세요"
            className="bg-white rounded-lg"
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <CreatableSelect
          className="mb-6"
          isMulti
          placeholder={"#태그를 입력하세요"}
          onChange={handleInputTag}
          options={tags.map((tag) => ({ value: tag.value, label: tag.label }))}
          value={tags.map((tag) => ({ value: tag.value, label: tag.label }))}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: "#e2e8f0",
              "&:hover": {
                borderColor: "#cbd5e0",
              },
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "#ebf4ff",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "#4a5568",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "#4a5568",
              "&:hover": {
                backgroundColor: "#bee3f8",
                color: "#2b6cb0",
              },
            }),
          }}
        />
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            className="w-full sm:w-auto py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            onClick={handleUpload}
          >
            {postId ? "Update" : "Upload"}
          </button>
          <button
            className="w-full sm:w-auto py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
        <Modal
          isOpen={isConfirmModalOpen}
          onRequestClose={() => setIsConfirmModalOpen(false)}
          className="w-11/12 max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-auto p-6"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
        >
          <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
            Are you sure you want to close?
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Yes
            </button>
            <button
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              No
            </button>
          </div>
        </Modal>
      </div>
    </Modal>
  );
}

export default PostUpload;
