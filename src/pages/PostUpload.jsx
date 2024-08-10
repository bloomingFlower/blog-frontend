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
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import { api } from "./components/api";
import { trackPromise } from "react-promise-tracker";
import sanitizeHtml from "sanitize-html";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import {
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

Quill.register("modules/imageUploader", ImageUploader);

function PostUpload({ setIsUploadModalOpen, postId, refreshPosts }) {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef(); // Quill 인스턴스에 접근하기 위한 ref
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef(null);
  const [composing, setComposing] = useState(false);
  const [lastAddedTag, setLastAddedTag] = useState("");
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
          // 태그 처리 로직 수정
          setTags(
            response.data.data.tags
              ? response.data.data.tags
                  .split(",")
                  .filter((tag) => tag.trim() !== "")
                  .map((tag) => ({ value: tag.trim(), label: tag.trim() }))
              : []
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
          refreshPosts(); // 게시물 목록 새로고침
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
          refreshPosts(); // 게시물 목록 새로고침
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

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (composing) return; // 조합 중일 때는 처리하지 않음

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const addTag = () => {
    let newTag = tagInput.trim();
    if (newTag && newTag !== lastAddedTag) {
      newTag = newTag.startsWith("#") ? newTag.slice(1) : newTag;
      if (!tags.some((existingTag) => existingTag.value === newTag)) {
        setTags([...tags, { value: newTag, label: newTag }]);
        setLastAddedTag(newTag);
      }
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag.value !== tagToRemove));
  };

  const handleClose = () => {
    if (isModified) {
      setIsConfirmModalOpen(true);
    } else {
      setIsUploadModalOpen(false);
      refreshPosts(); // 모달이 닫힐 때 게시물 목록 새로고침
    }
  };
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
    Modal.setAppElement("#root");
  }, []);

  const getFileIcon = (fileType) => {
    if (!fileType) return DocumentIcon;
    if (fileType.startsWith("image/")) return PhotoIcon;
    if (fileType.startsWith("video/")) return VideoCameraIcon;
    if (fileType === "application/pdf") return DocumentTextIcon;
    return DocumentIcon;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => {
        setIsUploadModalOpen(false);
        refreshPosts();
      }}
      contentLabel="Post Upload"
      className="w-11/12 max-w-4xl mx-auto my-4 bg-[#f8f5e6] rounded-lg shadow-2xl overflow-hidden"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4"
      style={{
        content: {
          maxHeight: "90vh",
          height: "auto",
        },
      }}
    >
      <div className="flex flex-col h-full">
        <nav className="bg-[#e6e0cc] py-2 px-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            {postId ? "Edit Your Story" : "Share Your Story"}
          </h2>
        </nav>
        <div className="p-6 flex-grow overflow-y-auto">
          <input
            ref={titleRef}
            className="w-full mb-4 p-2 text-lg border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300 bg-transparent"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            aria-label="Title"
          />
          <div className="mb-4" style={{ minHeight: "300px" }}>
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
              placeholder="Share your story..."
              className="bg-white rounded-lg h-full"
              style={{ height: "250px" }}
              aria-label="Content"
            />
          </div>
          <div className="mb-4">
            <div
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg focus-within:border-blue-500 transition duration-300 cursor-pointer bg-[#f0ead6] hover:bg-[#e6e0cc]"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="flex items-center justify-center">
                {file ? (
                  <>
                    {React.createElement(getFileIcon(file.type), {
                      className: "h-6 w-6 text-blue-500 mr-2",
                    })}
                    <span className="text-sm text-gray-700 truncate">
                      {fileName}
                    </span>
                  </>
                ) : (
                  <>
                    <DocumentIcon className="h-6 w-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      Click to select a file
                    </span>
                  </>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              onChange={handleFileChange}
              aria-label="File"
            />
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 p-2 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition duration-300 bg-[#f0ead6]">
              {tags.map((tag) => (
                <span
                  key={tag.value}
                  className="bg-[#e6e0cc] text-gray-700 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag.value}
                  <button
                    onClick={() => removeTag(tag.value)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => {
                  setComposing(false);
                  // 조합이 끝났을 때 태그를 즉시 추가하지 않음
                }}
                placeholder="Add a tag... (Enter to add)"
                className="flex-grow bg-transparent outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <footer className="bg-[#e6e0cc] p-4">
          <div className="flex space-x-4">
            <button
              className={`flex-1 py-2 px-4 bg-[#8b7d5e] text-white rounded-lg hover:bg-[#7a6c4e] transition duration-300 ${
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
              className={`flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleClose}
              disabled={isUploading}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </footer>
      </div>
    </Modal>
  );
}

export default PostUpload;
