// PostUpload.jsx
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import CreatableSelect from "react-select/creatable";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import { api } from "./components/api";
import { trackPromise } from "react-promise-tracker";
import sanitizeHtml from "sanitize-html";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

Quill.register("modules/imageUploader", ImageUploader);

function PostUpload({ setIsUploadModalOpen, postId }) {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef(); // Quill 인스턴스에 접근하기 위한 ref
  // TODO : 이미지 리사이즈, 압축 기능 구현

  // DOMPurify 설정
  const purifyConfig = {
    ADD_TAGS: ["img"],
    ADD_ATTR: ["src", "alt", "width", "height"],
  };

  const getApiUrl = () => {
    if (process.env.NODE_ENV === "development") {
      return process.env.REACT_APP_API_URL;
    }
    return window.ENV.REACT_APP_API_URL !== "%REACT_APP_API_URL%"
      ? window.ENV.REACT_APP_API_URL
      : "";
  };

  const imageUploader = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        toast.error("Please select an image");
        return reject("No file selected");
      }
      const formData = new FormData();
      formData.append("image", file);

      trackPromise(
        api({
          url: `${getApiUrl()}/api/v1/upload-img`,
          method: "POST",
          data: formData,
          withCredentials: true,
        })
      )
        .then((response) => {
          resolve(response.data.url);
        })
        .catch((error) => {
          toast.error("Failed to upload image");
          reject("Upload failed");
        });
    });
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection(true);

      try {
        const url = await imageUploader(file);
        quill.insertEmbed(range.index, "image", url);
      } catch (error) {
        toast.error("Failed to upload image:", error);
      }
    };
  }, [imageUploader]);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, [imageHandler]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await trackPromise(api.get(`/api/v1/post/${postId}`));
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
    if (isUploading) return;

    // title과 content가 비어있는지 확인
    if (!title.trim() || !editorState.trim()) {
      toast.error("Title or content cannot be empty");
      return;
    }

    setIsUploading(true);

    // DOMPurify를 사용하여 에디터 내용 살균 (이미지 태그 허용)
    const sanitizedContent = DOMPurify.sanitize(editorState, purifyConfig);

    // HTML Sanitization (기존 코드 유지, 추가적인 보안 층으로 사용)
    const cleanContent = sanitizeHtml(sanitizedContent, {
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
        img: ["src", "alt", "width", "height"],
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
    formData.append("tags", tagValues);
    if (file) {
      formData.append("file", file);
    }
    try {
      if (postId) {
        // If postId is provided, update the existing post
        const response = await trackPromise(
          api.put(`/api/v1/post/${postId}`, formData, {
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
          toast.error("Failed to update post");
        }
      } else {
        const response = await trackPromise(
          api.post("/api/v1/posts", formData, {
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
          toast.error("Failed to upload post");
        }
      }
    } catch (error) {
      toast.error(
        `Failed to ${postId ? "update" : "upload"} post: ${error.message}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (content) => {
    setIsModified(true);
    setEditorState(content);
  };

  const handleInputTag = useCallback(
    (newValue, actionMeta) => {
      if (actionMeta.action === "remove-value") {
        setTags(newValue);
      } else if (actionMeta.action === "create-option") {
        const newTag = newValue[newValue.length - 1];
        if (newTag.value.trim()) {
          setTags([...tags, { ...newTag, value: newTag.value.trim() }]);
        }
      }
    },
    [tags]
  );

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
      className="w-11/12 max-w-4xl mx-auto my-4 bg-white rounded-lg shadow-xl overflow-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4"
      style={{
        content: {
          maxHeight: "90vh",
          height: "auto",
        },
      }}
    >
      <div className="p-3 sm:p-4 md:p-6 flex flex-col">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-center text-gray-800">
          {postId ? "Edit Post" : "Upload a Post"}
        </h2>
        <input
          ref={titleRef}
          className="w-full mb-2 sm:mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-xs sm:text-sm"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
          aria-label="Title"
        />
        <div className="mb-2 sm:mb-3 flex-grow" style={{ minHeight: "200px" }}>
          <ReactQuill
            ref={quillRef}
            value={editorState}
            onChange={(content, delta, source, editor) => {
              const sanitizedContent = DOMPurify.sanitize(
                editor.getHTML(),
                purifyConfig
              );
              setEditorState(sanitizedContent);
            }}
            modules={modules}
            theme="snow"
            placeholder="내용을 입력해주세요"
            className="bg-white rounded-lg h-full text-xs sm:text-sm"
            aria-label="Content"
          />
        </div>
        <div className="mb-2 sm:mb-3">
          <input
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-xs sm:text-sm"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            aria-label="File"
          />
        </div>
        <CreatableSelect
          className="mb-3 sm:mb-4 text-xs sm:text-sm"
          isMulti
          placeholder={"# Include tags"}
          aria-label="Tags"
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
            placeholder: (provided) => ({
              ...provided,
              fontSize: "0.75rem",
              "@media (min-width: 640px)": {
                fontSize: "0.875rem",
              },
            }),
          }}
        />
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            className={`w-full sm:w-1/2 py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 text-xs sm:text-sm ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpload}
            disabled={isUploading}
            aria-label="Upload"
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                {postId ? "Updating..." : "Uploading..."}
              </div>
            ) : postId ? (
              "Update"
            ) : (
              "Upload"
            )}
          </button>
          <button
            className={`w-full sm:w-1/2 py-2 px-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300 text-xs sm:text-sm ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleClose}
            disabled={isUploading}
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PostUpload;
