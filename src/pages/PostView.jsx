// PostView.jsx
import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./components/api";
import { AuthContext } from "./components/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./components/LoadingIndicator";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";

Modal.setAppElement("#root");

function PostView({
  postId,
  setIsPostViewModalOpen,
  setEditingPostId,
  setIsUploadModalOpen,
  refreshPosts,
}) {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const commentSectionRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userDataString = sessionStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser(userData);
    }
  }, []);

  const canEditOrDelete = useMemo(() => {
    if (!user || !post || !post.user) {
      return false;
    }
    return user.id === post.user.id;
  }, [user, post]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await trackPromise(api.get(`/api/v1/post/${postId}`));
        if (response.data.data) {
          setPost(response.data.data);
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        navigate("/error");
      }
    };

    fetchPost();
  }, [postId, navigate]);

  useEffect(() => {
    if (post) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/remark42@latest/web/embed.js";
      script.async = true;

      script.onload = () => {
        if (window.REMARK42) {
          window.REMARK42.createInstance({
            host: "YOUR_REMARK42_HOST",
            siteId: "YOUR_SITE_ID",
            url: window.location.origin + window.location.pathname,
            componentName: "remark42",
            container: commentSectionRef.current,
          });
        }
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        if (window.REMARK42) {
          window.REMARK42.destroy();
        }
      };
    }
  }, [post]);

  if (!post) {
    return <LoadingIndicator />;
  }

  const handleEditClick = () => {
    setIsPostViewModalOpen(false); // 현재 모달을 닫습니다.
    setEditingPostId(postId); // 편집 중인 포스트의 ID를 설정합니다.
    setIsUploadModalOpen(true); // PostUpload 모달을 엽니다.
  };

  const handleHideClick = async () => {
    if (!isLoggedIn) {
      toast.warning("Login is required.");
      return;
    }
    if (!canEditOrDelete) {
      toast.warning("You do not have permission to hide or display this post.");
      return;
    }
    try {
      await trackPromise(api.put(`/api/v1/post/${postId}/hide`));
      toast.success(post.hidden ? "Post is displayed." : "Post is hidden.");
      setPost((prevPost) => ({ ...prevPost, hidden: !prevPost.hidden }));
      setIsPostViewModalOpen(false);
      refreshPosts();
    } catch (error) {
      toast.error("Failed to change post status:", error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => {
        setIsPostViewModalOpen(false);
        refreshPosts();
      }}
      shouldCloseOnOverlayClick={true}
      contentLabel="Post View"
      className="w-11/12 max-w-4xl mx-auto my-4 sm:my-10 bg-white rounded-lg shadow-xl overflow-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      style={{
        content: {
          maxHeight: "90vh",
        },
      }}
    >
      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center flex items-center justify-center">
          <FaUser className="mr-1 text-gray-400" />
          <span className="font-medium">{post.user?.first_name}</span>
          <span className="ml-1 text-xs bg-gray-200 text-gray-700 px-1 rounded">
            #{post.user?.id}
          </span>
        </p>
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <ReactQuill
            value={post.content}
            readOnly={true}
            theme="bubble"
            modules={{ toolbar: false }}
            className="prose max-w-none"
          />
        </div>
        <div className="mb-6 flex flex-wrap">
          {post.tags.split(",").map((tag, index) => (
            <span
              className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
              key={index}
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
        {post.file && (
          <a
            href={post.file}
            download={post.file.split("/").pop()}
            className="mb-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Download: {post.file.split("/").pop()}
          </a>
        )}
        <div ref={commentSectionRef} className="mb-6"></div>
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          {canEditOrDelete && (
            <>
              <button
                className="w-full sm:w-1/4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="w-full sm:w-1/4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                onClick={handleHideClick}
              >
                {post.hidden ? "Display" : "Hide"}
              </button>
            </>
          )}
          <button
            className="w-full sm:w-1/4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={() => setIsPostViewModalOpen(false)}
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PostView;
