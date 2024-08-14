import React, { useEffect, useReducer, useContext, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./components/api";
import { AuthContext } from "./components/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./components/LoadingIndicator";
import { toast } from "react-toastify";
import {
  FaUser,
  FaDownload,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCalendarAlt,
  FaHistory,
  FaFolder,
} from "react-icons/fa";
import { format } from "date-fns";

Modal.setAppElement("#root");

const initialState = {
  post: null,
  user: null,
  isPostStatusChanged: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_POST":
      return { ...state, post: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_POST_STATUS_CHANGED":
      return { ...state, isPostStatusChanged: action.payload };
    default:
      return state;
  }
}

function PostView({
  postId,
  setIsPostViewModalOpen,
  setEditingPostId,
  setIsUploadModalOpen,
  refreshPosts,
  setIsPostStatusChanged,
  setLoadingPostId,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const commentSectionRef = useRef(null);

  useEffect(() => {
    const userDataString = sessionStorage.getItem("user");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      dispatch({ type: "SET_USER", payload: userData });
    }
  }, []);

  const canEditOrDelete = useMemo(() => {
    if (!state.user || !state.post || !state.post.user) {
      return false;
    }
    return state.user.id === state.post.user.id;
  }, [state.user, state.post]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await trackPromise(api.get(`/api/v1/post/${postId}`));
        if (response.data.data) {
          dispatch({ type: "SET_POST", payload: response.data.data });
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        navigate("/error");
      }
    };

    fetchPost();
  }, [postId]);

  // useEffect(() => {
  //   if (state.post) {
  //     const script = document.createElement("script");
  //     script.src = "https://cdn.jsdelivr.net/npm/remark42@latest/web/embed.js";
  //     script.async = true;

  //     script.onload = () => {
  //       if (window.REMARK42) {
  //         window.REMARK42.createInstance({
  //           host: "YOUR_REMARK42_HOST",
  //           siteId: "YOUR_SITE_ID",
  //           url: window.location.origin + window.location.pathname,
  //           componentName: "remark42",
  //           container: commentSectionRef.current,
  //         });
  //       }
  //     };

  //     document.body.appendChild(script);

  //     return () => {
  //       document.body.removeChild(script);
  //       if (window.REMARK42) {
  //         window.REMARK42.destroy();
  //       }
  //     };
  //   }
  // }, [state.post]);

  useEffect(() => {
    // Release loading state when data is loaded
    return () => setLoadingPostId(null);
  }, [postId, setLoadingPostId]);

  const handleEditClick = () => {
    setIsPostViewModalOpen(false);
    setEditingPostId(postId);
    setIsUploadModalOpen(true);
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
      toast.success(state.post.hidden ? "Post is displayed." : "Post is hidden.");
      dispatch({ type: "SET_POST", payload: { ...state.post, hidden: !state.post.hidden } });
      dispatch({ type: "SET_POST_STATUS_CHANGED", payload: true });
      setIsPostStatusChanged(true);
    } catch (error) {
      toast.error("Failed to change post status:", error);
    }
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date.getFullYear() > 1970;
  };

  const formatDate = (dateString) => {
    if (!isValidDate(dateString)) {
      return 'N/A';
    }
    return format(new Date(dateString), "yyyy.MM.dd HH:mm");
  };

  const closeModal = () => {
    if (state.isPostStatusChanged) {
      refreshPosts();
    }
    setIsPostViewModalOpen(false);
  };

  if (!state.post) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
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
      <article className="p-4 sm:p-6 md:p-8">
        <header>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
            {state.post.title}
          </h2>
          <div className="flex flex-col items-center justify-center mb-4 text-xs text-gray-500">
            <div className="flex items-center mb-1">
              <FaUser className="mr-1" />
              <span className="font-medium">{state.post.user?.first_name}</span>
              <span className="ml-1 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                #{state.post.user?.id}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <time className="flex items-center" dateTime={state.post.created_at}>
                <FaCalendarAlt className="mr-1" />
                <span>{formatDate(state.post.created_at)}</span>
              </time>
              {isValidDate(state.post.updated_at) && state.post.updated_at !== state.post.created_at && (
                <time className="flex items-center" dateTime={state.post.updated_at}>
                  <FaHistory className="mr-1" />
                  <span>{formatDate(state.post.updated_at)}</span>
                </time>
              )}
            </div>

            {state.post.category && (
              <div className="flex items-center mt-1">
                <FaFolder className="mr-1" />
                <span className="font-medium">{state.post.category}</span>
              </div>
            )}
          </div>
        </header>
        <section className="mb-6 bg-gray-50 rounded-lg p-4 shadow-inner">
          <ReactQuill
            value={state.post.content}
            readOnly={true}
            theme="bubble"
            modules={{ toolbar: false }}
            className="prose max-w-none text-base"
          />
        </section>
        {state.post.tags && state.post.tags.split(",").some((tag) => tag.trim() !== "") && (
          <section className="mb-4 flex flex-wrap">
            {state.post.tags.split(",").map(
              (tag, index) =>
                tag.trim() !== "" && (
                  <span
                    className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-semibold mr-2 mb-2"
                    key={index}
                  >
                    #{tag.trim()}
                  </span>
                )
            )}
          </section>
        )}
        {state.post.file && (
          <section className="mb-4">
            <a
              href={`${api.defaults.baseURL}/api/v1/${state.post.file}`}
              download={state.post.file.split("/").pop()}
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded transition duration-300"
            >
              <FaDownload className="mr-1 text-xs" />
              {state.post.file.split("/").pop()}
            </a>
          </section>
        )}
        <section ref={commentSectionRef} className="mb-4"></section>
        <div className="flex justify-end">
          {canEditOrDelete ? (
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition duration-300 flex items-center justify-center"
                onClick={handleEditClick}
              >
                <FaEdit className="mr-1 text-xs" />
                Edit
              </button>
              <button
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm py-2 px-3 rounded transition duration-300 flex items-center justify-center"
                onClick={handleHideClick}
              >
                {state.post.hidden ? (
                  <FaEye className="mr-1 text-xs" />
                ) : (
                  <FaEyeSlash className="mr-1 text-xs" />
                )}
                {state.post.hidden ? "Display" : "Hide"}
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded transition duration-300 flex items-center justify-center"
                onClick={closeModal}
                aria-label="Close"
              >
                <FaTimes className="mr-1 text-xs" />
                Close
              </button>
            </div>
          ) : (
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs py-1 px-2 rounded transition duration-300 flex items-center justify-center"
              onClick={closeModal}
              aria-label="Close"
            >
              <FaTimes className="mr-1 text-xs" />
              Close
            </button>
          )}
        </div>
      </article>
    </Modal>
  );
}

export default PostView;