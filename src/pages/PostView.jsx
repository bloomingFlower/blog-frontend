import React, {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./components/api";
import { AuthContext } from "./components/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import { calculateReadingTime } from "../utils/readingTime.js";
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
  FaClock,
} from "react-icons/fa";
import { format } from "date-fns";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
} from "react-share";
// import { KakaoLinkDefault } from "react-kakao-link";

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
  isModal = true,
  isSinglePostPage = false,
  onClose,
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
    // Initialize Kakao SDK
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init("YOUR_KAKAO_APP_KEY");
    }
  }, []);

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
      toast.success(
        state.post.hidden ? "Post is displayed." : "Post is hidden."
      );
      dispatch({
        type: "SET_POST",
        payload: { ...state.post, hidden: !state.post.hidden },
      });
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
      return "N/A";
    }
    return format(new Date(dateString), "yyyy.MM.dd HH:mm");
  };

  const closeModal = () => {
    if (isSinglePostPage) {
      onClose();
    } else {
      if (state.isPostStatusChanged) {
        refreshPosts();
      }
      setIsPostViewModalOpen(false);
    }
  };

  const shareUrl = `${window.location.origin}/post/${postId}`;
  const shareTitle = state.post ? state.post.title : "";
  const shareMessage = "Read this amazing post! 👀✨";

  // const kakaoLinkDefault = useMemo(() => {
  //   return new KakaoLinkDefault({
  //     objectType: "feed",
  //     content: {
  //       title: shareTitle,
  //       description: shareMessage,
  //       imageUrl: "YOUR_IMAGE_URL", // 공유할 이미지 URL
  //       link: {
  //         mobileWebUrl: shareUrl,
  //         webUrl: shareUrl,
  //       },
  //     },
  //     buttons: [
  //       {
  //         title: "웹으로 보기",
  //         link: {
  //           mobileWebUrl: shareUrl,
  //           webUrl: shareUrl,
  //         },
  //       },
  //     ],
  //   });
  // }, [shareUrl, shareTitle]);

  const handleLinkClick = useCallback((e) => {
    const target = e.target;
    if (target.tagName === "A" && target.href) {
      e.preventDefault();
      if (window.confirm("Do you want to go to the external link?")) {
        window.open(target.href, "_blank", "noopener,noreferrer");
      }
    }
  }, []);

  useEffect(() => {
    const contentElement = document.querySelector(".ql-editor");
    if (contentElement) {
      contentElement.addEventListener("click", handleLinkClick);
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener("click", handleLinkClick);
      }
    };
  }, [handleLinkClick]);

  if (!state.post) {
    return null;
  }

  const content = (
    <article className="p-4 sm:p-6 md:p-8">
      <header className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
          {state.post.title}
        </h2>
        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 -mx-2">
          <div className="px-2 w-1/2 sm:w-auto mb-2 sm:mb-0 flex items-center">
            <FaUser className="mr-1" />
            <span>{state.post.user?.first_name}</span>
            <span className="ml-1 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
              #{state.post.user?.id}
            </span>
          </div>
          <time
            className="px-2 w-1/2 sm:w-auto mb-2 sm:mb-0 flex items-center"
            dateTime={state.post.created_at}
          >
            <FaCalendarAlt className="mr-1" />
            <span>{formatDate(state.post.created_at)}</span>
          </time>
          {state.post.category && (
            <div className="px-2 w-1/2 sm:w-auto mb-2 sm:mb-0 flex items-center">
              <FaFolder className="mr-1" />
              <span>{state.post.category}</span>
            </div>
          )}
          <div className="px-2 w-1/2 sm:w-auto mb-2 sm:mb-0 flex items-center">
            <FaClock className="mr-1" />
            <span>{calculateReadingTime(state.post.content)} min read</span>
          </div>
        </div>
      </header>

      <section className="mb-6 bg-gray-50 rounded-lg p-4 shadow-inner h-108 md:h-120 lg:h-128 overflow-auto">
        <ReactQuill
          value={state.post.content}
          readOnly={true}
          theme="bubble"
          modules={{ toolbar: false }}
          className="prose max-w-none text-base h-full"
        />
      </section>

      {state.post.tags &&
        state.post.tags.split(",").some((tag) => tag.trim() !== "") && (
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

      <section ref={commentSectionRef} className="mt-8"></section>
    </article>
  );

  if (!isModal) {
    return content;
  }

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={true}
      contentLabel="Post View"
      className="w-11/12 max-w-4xl mx-auto my-4 sm:my-10 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
      style={{
        content: {
          height: "80vh",
          maxHeight: "800px",
        },
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto">{content}</div>
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex space-x-2">
            <FacebookShareButton
              url={shareUrl}
              quote={`${shareMessage} ${shareTitle}`}
            >
              <FacebookIcon size={24} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={shareUrl}
              title={`${shareMessage} ${shareTitle}`}
            >
              <TwitterIcon size={24} round />
            </TwitterShareButton>
            <LinkedinShareButton
              url={shareUrl}
              title={shareTitle}
              summary={shareMessage}
            >
              <LinkedinIcon size={24} round />
            </LinkedinShareButton>
            <TelegramShareButton
              url={shareUrl}
              title={`${shareMessage} ${shareTitle}`}
            >
              <TelegramIcon size={24} round />
            </TelegramShareButton>
          </div>
          <div className="flex items-center space-x-2">
            {canEditOrDelete && (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition duration-300 flex items-center"
                  onClick={handleEditClick}
                >
                  <FaEdit className="mr-1 text-xs" />
                  Edit
                </button>
                <button
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs py-1 px-2 rounded transition duration-300 flex items-center"
                  onClick={handleHideClick}
                >
                  {state.post.hidden ? (
                    <FaEye className="mr-1 text-xs" />
                  ) : (
                    <FaEyeSlash className="mr-1 text-xs" />
                  )}
                  {state.post.hidden ? "Display" : "Hide"}
                </button>
              </>
            )}
            <button
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs py-1 px-2 rounded inline-flex items-center"
            >
              <FaTimes className="mr-1" />
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PostView;
