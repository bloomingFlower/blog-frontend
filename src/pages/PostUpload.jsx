import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
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
import { api } from "./components/api";
import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { categoryOptions } from "../constants/categories";
import PlaygroundEditorTheme from "../themes/PlaygroundEditorTheme";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { AuthContext } from "./components/AuthContext";
import { CLEAR_EDITOR_COMMAND } from "lexical";

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
  ],
};

const PostUploadContent = React.memo(
  ({ refreshPosts, editingPostId, editingPost }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState(() => {
      return () => {
        const root = $getRoot();
        const paragraph = $createParagraphNode();
        root.append(paragraph);
      };
    });
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [fileUploadError, setFileUploadError] = useState("");
    const fileInputRef = useRef(null);
    const [composing, setComposing] = useState(false);
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      if (editingPost && editingPost.content) {
        try {
          const parsedContent = JSON.parse(editingPost.content);

          editor.update(() => {
            const root = $getRoot();
            root.clear();

            if (typeof parsedContent === "string") {
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(parsedContent));
              root.append(paragraph);
            } else if (parsedContent.root && parsedContent.root.children) {
              parsedContent.root.children.forEach((node) => {
                if (node.type === "paragraph") {
                  const paragraph = $createParagraphNode();
                  if (node.children) {
                    node.children.forEach((child) => {
                      if (child.type === "text") {
                        paragraph.append($createTextNode(child.text));
                      }
                    });
                  }
                  root.append(paragraph);
                }
              });
            }

            console.log(
              "새로운 root 내용 (업데이트 전):",
              root.getTextContent()
            );

            // editor의 상태를 강제로 업데이트
            editor.setEditorState(editor.getEditorState());
          });

          // editor의 상태 변경을 감지하여 editorState 업데이트 및 확인
          const unregister = editor.registerUpdateListener(
            ({ editorState }) => {
              setEditorState(editorState);

              // 상태 업데이트 후 내용 확인
              editor.update(() => {
                const root = $getRoot();
                console.log("업데이트된 root 내용:", root.getTextContent());
              });

              unregister();
            }
          );

          // 추가: 일정 시간 후 다시 한 번 내용 확인
          setTimeout(() => {
            editor.update(() => {
              const root = $getRoot();
              console.log("지연 후 root 내용:", root.getTextContent());
            });
          }, 1000);
        } catch (error) {
          console.error("Failed to parse fetched content:", error);
        }
      }
    }, [editingPost, editor]);

    useEffect(() => {
      if (editingPost) {
        setTitle(editingPost.title || "");
        setTags(
          editingPost.tags
            ? editingPost.tags
                .split(",")
                .filter((tag) => tag.trim())
                .map((tag) => ({ value: tag.trim(), label: tag.trim() }))
            : []
        );
        setCategory(editingPost.category || "");
        if (editingPost.file) {
          const filePath = editingPost.file;
          const fileName = filePath.split("/").pop();
          setFileName(fileName);
          setFile(new File([], fileName));
        }
      }
    }, [editingPost]);

    const handleUpload = useCallback(
      async (e) => {
        e.preventDefault();
        if (isUploading) return;

        if (!title.trim() || !editorState.toJSON().root.children.length) {
          setUpdateMessage("Please enter both title and content.");
          return;
        }

        setUpdateMessage("");
        setFileUploadError("");
        setIsUploading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", JSON.stringify(editorState.toJSON()));
        const tagValues = tags.map((tag) => tag.value).join(",");
        formData.append("tags", tagValues);
        formData.append("category", category || "Others");
        if (file) {
          formData.append("file", file);
        }

        try {
          let response;
          if (editingPost) {
            response = await trackPromise(
              api.put(`/api/v1/post/${editingPost.id}`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
            );
          } else {
            response = await trackPromise(
              api.post("/api/v1/posts", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
            );
          }

          if (response.status === 200) {
            toast.success(
              editingPost
                ? "Post updated successfully."
                : "Post uploaded successfully."
            );
            navigate("/post");
          } else {
            toast.error(
              editingPost ? "Post update failed." : "Post upload failed."
            );
          }
        } catch (error) {
          console.error("Upload/Update error:", error);
          setUpdateMessage(
            `${editingPost ? "Update" : "Upload"} failed: ${error.message}`
          );
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            if (error.response.data.message.includes("file")) {
              setFileUploadError(
                `File upload failed: ${error.response.data.message}`
              );
            }
          }
        } finally {
          setIsUploading(false);
        }
      },
      [
        title,
        editorState,
        tags,
        category,
        file,
        editingPost,
        navigate,
        refreshPosts,
      ]
    );

    const handleTagInputChange = useCallback((e) => {
      setTagInput(e.target.value);
    }, []);

    const handleTagInputKeyDown = useCallback(
      (e) => {
        if (composing) return;

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          addTag();
        } else if (
          e.key === "Backspace" &&
          tagInput === "" &&
          tags.length > 0
        ) {
          setTags(tags.slice(0, -1));
        }
      },
      [composing, tagInput, tags]
    );

    const handleTagInputBlur = () => {
      addTag();
    };

    const addTag = () => {
      let newTag = tagInput.trim();
      if (newTag) {
        newTag = newTag.startsWith("#") ? newTag.slice(1) : newTag;
        if (!tags.some((existingTag) => existingTag.value === newTag)) {
          setTags([...tags, { value: newTag, label: newTag }]);
        }
      }
      setTagInput("");
    };

    const removeTag = (tagToRemove) => {
      setTags(tags.filter((tag) => tag.value !== tagToRemove));
    };

    const handleCategorySelect = useCallback((e, selectedCategory) => {
      e.preventDefault();
      setCategory((prevCategory) =>
        selectedCategory === prevCategory ? "" : selectedCategory
      );
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

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        setFileName(truncateFileName(selectedFile.name));
      }
    };

    const getFileIcon = (fileType) => {
      if (!fileType) return DocumentIcon;
      if (fileType.startsWith("image/")) return PhotoIcon;
      if (fileType.startsWith("video/")) return VideoCameraIcon;
      if (fileType === "application/pdf") return DocumentTextIcon;
      return DocumentIcon;
    };

    const uploadCategoryOptions = categoryOptions.filter(
      (category) => category !== "All"
    );

    const removeFile = () => {
      setFile(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleEditorChange = useCallback((editorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const content = root.getTextContent();
      });
      setEditorState(editorState);
    }, []);

    const editorConfig = useMemo(
      () => ({
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
        ],
      }),
      []
    );

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

    return (
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-4 sm:mt-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <h1 className="text-base sm:text-lg md:text-xl font-bold transition-all duration-300">
              {editingPostId ? "Edit Post" : "Create New Post"}
            </h1>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleClose}
                className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-300"
                title="Close"
              >
                <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="submit"
                form="post-form"
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                disabled={isUploading}
                title={
                  isUploading
                    ? "Processing"
                    : editingPostId
                    ? "Update"
                    : "Upload"
                }
              >
                {isUploading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>

          <form id="post-form" onSubmit={handleUpload}>
            <input
              className="w-full mb-3 sm:mb-4 p-2 text-sm sm:text-base border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
            />

            <div
              className="mb-3 sm:mb-4 border rounded overflow-y-auto transition-all duration-300 ease-in-out
                          h-[calc(100vh-24rem)] sm:h-[calc(100vh-28rem)] md:h-[calc(100vh-32rem)] lg:h-[calc(100vh-36rem)]"
            >
              <LexicalComposer
                initialConfig={{
                  ...editorConfig,
                  editorState: editorState,
                  onError: (error) => {
                    console.error("Lexical error:", error);
                  },
                }}
              >
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="outline-none h-full p-2" />
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <ListPlugin />
                <LinkPlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                <OnChangePlugin onChange={handleEditorChange} />
              </LexicalComposer>
            </div>

            <div className="mb-3 sm:mb-4">
              <div
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg focus-within:border-blue-500 transition duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="flex items-center justify-center">
                  {file || fileName ? (
                    <>
                      {React.createElement(getFileIcon(file ? file.type : ""), {
                        className: "h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2",
                      })}
                      <span
                        className="text-xs sm:text-sm text-gray-700 truncate max-w-[200px]"
                        title={file ? file.name : fileName}
                      >
                        {fileName || (file && truncateFileName(file.name))}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <DocumentIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 mr-2" />
                      <span className="text-xs sm:text-sm text-gray-500">
                        Select a file (jpg, jpeg, png, webp, txt, pdf; max 10MB)
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
                accept=".jpg,.jpeg,.png,.webp,.txt,.pdf"
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-2 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition duration-300 bg-gray-100">
                {tags.map((tag) => (
                  <span
                    key={tag.value}
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs sm:text-sm flex items-center"
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
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={handleTagInputBlur}
                  onCompositionStart={() => setComposing(true)}
                  onCompositionEnd={() => {
                    setComposing(false);
                  }}
                  placeholder={
                    tags.length === 0 ? "Add a tag... (Enter to add)" : ""
                  }
                  className="flex-grow bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label
                className="block text-xs font-medium text-gray-700 mb-1"
                htmlFor="post-category"
              >
                Category
              </label>
              <div className="relative">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                  <div className="flex space-x-1 sm:space-x-2">
                    {uploadCategoryOptions.map((option) => (
                      <button
                        key={option}
                        onClick={(e) => handleCategorySelect(e, option)}
                        type="button"
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${
                          category === option
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {category && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                  Selected category: {category}
                </p>
              )}
              {!category && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                  Category not selected (Default: "Others")
                </p>
              )}
            </div>

            {updateMessage && (
              <p className="text-red-500 mb-2 text-xs">{updateMessage}</p>
            )}
            {fileUploadError && (
              <p className="text-red-500 text-xs mt-2">{fileUploadError}</p>
            )}
          </form>
        </div>
      </div>
    );
  }
);

function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);

  return null;
}

const PostUpload = React.memo(({ refreshPosts }) => {
  const { postId } = useParams();
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      const response = await api.get(`/api/v1/post/${postId}`);
      if (response.data.data) {
        setEditingPost(response.data.data);
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
      toast.error("Failed to load post data for editing");
      navigate("/post");
    } finally {
      setIsLoading(false);
    }
  }, [postId, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/post/edit/${postId}` } });
      return;
    }

    if (postId) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigate, postId, fetchPost]);

  const checkUserPermission = useCallback(() => {
    if (!user || !editingPost) return false;
    return user.id === editingPost.user.id;
  }, [user, editingPost]);

  useEffect(() => {
    if (!isLoading && editingPost && !checkUserPermission()) {
      toast.error("You don't have permission to edit this post.");
      navigate("/post");
    }
  }, [isLoading, editingPost, checkUserPermission, navigate]);

  if (!isLoggedIn || isLoading) {
    return null;
  }

  if (postId && !editingPost) {
    return null;
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <PostUploadContent
        editingPostId={postId}
        refreshPosts={refreshPosts}
        editingPost={editingPost}
      />
    </LexicalComposer>
  );
});

export default PostUpload;
