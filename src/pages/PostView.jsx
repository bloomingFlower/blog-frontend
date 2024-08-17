import React, {
  useEffect,
  useReducer,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "./components/api";
import { AuthContext } from "./components/AuthContext";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import { calculateReadingTime } from "../utils/readingTime.js";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  $parseSerializedNode,
  EditorState,
} from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import PlaygroundEditorTheme from "../themes/PlaygroundEditorTheme";
import {
  FaUser,
  FaDownload,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCalendarAlt,
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
import { usePromiseTracker } from "react-promise-tracker";
import LoadingIndicator from "./components/LoadingIndicator";
import {
  HashtagNode,
  $createHashtagNode,
  $isHashtagNode,
} from "@lexical/hashtag";

const initialState = {
  post: null,
  user: null,
  isPostStatusChanged: false,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_POST":
      return { ...state, post: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_POST_STATUS_CHANGED":
      return { ...state, isPostStatusChanged: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const editorConfig = {
  namespace: "MyEditor",
  theme: PlaygroundEditorTheme,
  onError(error) {
    console.error("Lexical error:", error);
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    HashtagNode,
  ],
  editable: false,
  editorState: (editor) => {
    const root = $getRoot();
    if (root.getFirstChild() === null) {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode("Loading content..."));
      root.append(paragraph);
    }
  },
};

function Editor({ content }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content) return;

    const updateEditorState = () => {
      const root = $getRoot();
      root.clear();

      try {
        // Try JSON Parsing
        const parsedContent =
          typeof content === "string" ? JSON.parse(content) : content;
        const state = editor.parseEditorState(parsedContent);
        editor.setEditorState(state);
      } catch (error) {
        // JSON Parsing Failed, Treat as HTML
        console.warn("Content is not in JSON format, treating as HTML");
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);

        // Handle hashtags
        nodes.forEach((node) => {
          if ($isTextNode(node)) {
            const textContent = node.getTextContent();
            const words = textContent.split(/\s+/);
            const newNodes = words.map((word) => {
              if (word.startsWith("#")) {
                return $createHashtagNode(word.slice(1));
              }
              return $createTextNode(word);
            });
            node.replace($createParagraphNode().append(...newNodes));
          }
        });

        root.append(...nodes);
      }
    };

    editor.update(updateEditorState);
  }, [editor, content]);

  return null;
}

function PostView() {
  const { postId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const commentSectionRef = useRef(null);
  const { promiseInProgress } = usePromiseTracker();

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

  const fetchPost = useCallback(async () => {
    if (!postId) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await trackPromise(api.get(`/api/v1/post/${postId}`));
      if (response.data.data) {
        dispatch({ type: "SET_POST", payload: response.data.data });
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      navigate("/error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [postId, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleEditClick = useCallback(() => {
    navigate(`/post/edit/${postId}`);
  }, [navigate, postId]);

  const handleHideClick = useCallback(async () => {
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
      dispatch({
        type: "SET_POST",
        payload: { ...state.post, hidden: !state.post.hidden },
      });
      dispatch({ type: "SET_POST_STATUS_CHANGED", payload: true });
    } catch (error) {
      toast.error("Failed to change post status:", error);
    }
  }, [isLoggedIn, canEditOrDelete, state.post, postId]);

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

  const handleClose = useCallback(() => {
    navigate("/post");
  }, [navigate]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [handleClose]);

  const shareData = useMemo(
    () => ({
      url: `${window.location.origin}/post/${postId}`,
      title: state.post ? state.post.title : "",
      message: "Read this amazing post! 👀✨",
    }),
    [postId, state.post]
  );

  const handleLinkClick = useCallback((e) => {
    const target = e.target;
    if (target.tagName === "A" && target.href) {
      e.preventDefault();
      if (window.confirm("Do you want to go to the external link?")) {
        window.open(target.href, "_blank", "noopener,noreferrer");
      }
    }
  }, []);

  const truncateFileName = (fileName) => {
    if (fileName.length <= 20) return fileName;

    const extension = fileName.split(".").pop();
    const nameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf(".")
    );

    if (nameWithoutExtension.length <= 16) return fileName;

    return `${nameWithoutExtension.substring(0, 13)}...${extension}`;
  };

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

  if (state.isLoading || promiseInProgress) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800">
        <LoadingIndicator />
      </div>
    );
  }

  if (!state.post) {
    return null;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-8 mb-8">
      <div className="max-w-full sm:max-w-4xl mx-auto">
        <article className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
          <header className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-gray-800">
              {state.post.title}
            </h1>
            <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 -mx-1 sm:-mx-2">
              <div className="px-1 sm:px-2 mb-1 sm:mb-0 flex items-center">
                <FaUser className="mr-1 sm:mr-2" />
                <span>{state.post.user?.first_name}</span>
                <span className="ml-1 bg-gray-200 text-gray-700 px-1 sm:px-2 py-0.5 rounded-full text-xs">
                  #{state.post.user?.id}
                </span>
              </div>
              <time
                className="px-1 sm:px-2 mb-1 sm:mb-0 flex items-center"
                dateTime={state.post.created_at}
              >
                <FaCalendarAlt className="mr-1 sm:mr-2" />
                <span>{formatDate(state.post.created_at)}</span>
              </time>
              {state.post.category && (
                <div className="px-1 sm:px-2 mb-1 sm:mb-0 flex items-center">
                  <FaFolder className="mr-1 sm:mr-2" />
                  <span>{state.post.category}</span>
                </div>
              )}
              <div className="px-1 sm:px-2 mb-1 sm:mb-0 flex items-center">
                <FaClock className="mr-1 sm:mr-2" />
                <span>{calculateReadingTime(state.post.content)} min read</span>
              </div>
            </div>
          </header>

          <section className="mb-4 sm:mb-8 bg-gray-50 rounded-lg p-3 sm:p-6 shadow-inner">
            <LexicalComposer initialConfig={editorConfig}>
              <RichTextPlugin
                contentEditable={<ContentEditable className="outline-none" />}
                placeholder={<div>No content...</div>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              <Editor content={state.post?.content || ""} />
            </LexicalComposer>
          </section>

          {state.post.tags &&
            state.post.tags.split(",").some((tag) => tag.trim() !== "") && (
              <section className="mb-4 sm:mb-6 flex flex-wrap">
                {state.post.tags.split(",").map(
                  (tag, index) =>
                    tag.trim() !== "" && (
                      <span
                        className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
                        key={index}
                      >
                        #{tag.trim()}
                      </span>
                    )
                )}
              </section>
            )}

          {state.post.file && (
            <section className="mb-4 sm:mb-6">
              <a
                href={`${api.defaults.baseURL}/api/v1/${state.post.file}`}
                download={state.post.file.split("/").pop()}
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm py-1 sm:py-2 px-2 sm:px-4 rounded transition duration-300"
                title={state.post.file.split("/").pop()} // 전체 파일명을 툴팁으로 표시
              >
                <FaDownload className="mr-1 sm:mr-2" />
                {truncateFileName(state.post.file.split("/").pop())}
              </a>
            </section>
          )}

          <section ref={commentSectionRef} className="mt-4 sm:mt-8"></section>
        </article>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 sm:mb-0">
              <FacebookShareButton
                url={shareData.url}
                quote={`${shareData.message} ${shareData.title}`}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareData.url}
                title={`${shareData.message} ${shareData.title}`}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={shareData.url}
                title={shareData.title}
                summary={shareData.message}
              >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <TelegramShareButton
                url={shareData.url}
                title={`${shareData.message} ${shareData.title}`}
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
            </div>
            <div className="flex items-center space-x-2">
              {canEditOrDelete && (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded transition duration-300 flex items-center text-xs sm:text-sm"
                    onClick={handleEditClick}
                  >
                    <FaEdit className="mr-1 sm:mr-2" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="bg-amber-500 hover:bg-amber-600 text-white py-1 sm:py-2 px-2 sm:px-4 rounded transition duration-300 flex items-center text-xs sm:text-sm"
                    onClick={handleHideClick}
                  >
                    {state.post.hidden ? (
                      <FaEye className="mr-1 sm:mr-2" />
                    ) : (
                      <FaEyeSlash className="mr-1 sm:mr-2" />
                    )}
                    <span>{state.post.hidden ? "Display" : "Hide"}</span>
                  </button>
                </>
              )}
              <button
                onClick={handleClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 sm:py-2 px-2 sm:px-4 rounded transition duration-300 flex items-center text-xs sm:text-sm"
              >
                <FaTimes className="mr-1 sm:mr-2" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostView;
