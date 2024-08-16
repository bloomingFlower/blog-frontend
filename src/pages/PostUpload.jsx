import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
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
import PlaygroundEditorTheme from '../themes/PlaygroundEditorTheme';
import { $getRoot, $createParagraphNode, $createTextNode, $createNodeSelection } from 'lexical';
import { AuthContext } from "./components/AuthContext";

const editorConfig = {
  namespace: 'MyEditor',
  theme: PlaygroundEditorTheme,
  onError(error) {
    console.error('Lexical error:', error);
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
    LinkNode
  ],
};

function Editor({ onChange, initialContent }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        try {
          if (typeof initialContent === 'string') {
            const parsedContent = JSON.parse(initialContent);
            if (parsedContent.root && parsedContent.root.children) {
              const state = editor.parseEditorState(parsedContent);
              editor.setEditorState(state);
            } else {
              throw new Error('Invalid content structure');
            }
          } else if (initialContent.root && initialContent.root.children) {
            const state = editor.parseEditorState(initialContent);
            editor.setEditorState(state);
          } else {
            throw new Error('Invalid content structure');
          }
        } catch (error) {
          console.error('Failed to parse editor state:', error);
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(typeof initialContent === 'string' ? initialContent : ''));
          root.append(paragraph);
        }
      });
    }
  }, [editor, initialContent]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(JSON.stringify(editorState.toJSON()));
    });
  }, [editor, onChange]);

  return null;
}

function PostUploadContent({ refreshPosts, editingPostId, editingPost }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState(() => {
    if (editingPost && editingPost.content) {
      try {
        return JSON.parse(editingPost.content);
      } catch (error) {
        console.error('Failed to parse fetched content:', error);
        return editingPost.content;
      }
    }
    return '';
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

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || "");
      if (editingPost.content) {
        try {
          const parsedContent = JSON.parse(editingPost.content);
          setEditorContent(parsedContent);
        } catch (error) {
          console.error('Failed to parse fetched content:', error);
          setEditorContent(editingPost.content);
        }
      }
      setTags(editingPost.tags ? editingPost.tags.split(',').filter(tag => tag.trim()).map(tag => ({ value: tag.trim(), label: tag.trim() })) : []);
      setCategory(editingPost.category || "");
      if (editingPost.file) {
        const filePath = editingPost.file;
        const fileName = filePath.split('/').pop();
        setFileName(fileName);
        setFile(new File([], fileName));
      }
    }
  }, [editingPost]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (isUploading) return;

    console.log("Current state before upload:", { title, editorContent, tags, category, file });
    if (!title.trim() || !editorContent) {
      setUpdateMessage("Please enter both title and content.");
      return;
    }

    setUpdateMessage("");
    setFileUploadError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", typeof editorContent === 'string' ? editorContent : JSON.stringify(editorContent));
    const tagValues = tags.map((tag) => tag.value).join(",");
    formData.append("tags", tagValues);
    formData.append("category", category || "Others");
    if (file) {
      formData.append("file", file);
    }

    try {
      let response;
      console.log("editingPost:", editingPost);
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
          api.post("/api/v1/post", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        );
      }

      if (response.status === 200) {
        toast.success(editingPost ? "Post updated successfully." : "Post uploaded successfully.");
        navigate('/post');
        refreshPosts();
      } else {
        toast.error(editingPost ? "Post update failed." : "Post upload failed.");
      }
    } catch (error) {
      console.error("Upload/Update error:", error);
      setUpdateMessage(`${editingPost ? "Update" : "Upload"} failed: ${error.message}`);
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes("file")) {
          setFileUploadError(`File upload failed: ${error.response.data.message}`);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (composing) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
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
    setCategory(selectedCategory === category ? "" : selectedCategory);
  }, [category]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
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

  const handleEditorChange = useCallback((newContent) => {
    setEditorContent(newContent);
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-4 sm:mt-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-6">
        {/* Updated header section with responsive font sizes and spacing */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h1 className="text-base sm:text-lg md:text-xl font-bold transition-all duration-300">
            {editingPostId ? "Edit Post" : "Create New Post"}
          </h1>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate('/post')}
              className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition duration-300"
              title="Close"
            >
              <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="submit"
              form="post-form"
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
              disabled={isUploading}
              title={isUploading ? "Processing" : (editingPostId ? "Update" : "Upload")}
            >
              <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Form with id for button association */}
        <form id="post-form" onSubmit={handleUpload}>
          <input
            className="w-full mb-3 sm:mb-4 p-2 text-sm sm:text-base border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition duration-300"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
          />

          <div className="mb-3 sm:mb-4 border rounded overflow-y-auto transition-all duration-300 ease-in-out
                          h-[calc(100vh-24rem)] sm:h-[calc(100vh-28rem)] md:h-[calc(100vh-32rem)] lg:h-[calc(100vh-36rem)]">
            <LexicalComposer initialConfig={editorConfig}>
              <RichTextPlugin
                contentEditable={<ContentEditable className="outline-none h-full p-2" />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
              <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              <Editor onChange={handleEditorChange} initialContent={editorContent} />
            </LexicalComposer>
          </div>

          <div className="mb-3 sm:mb-4">
            <div
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg focus-within:border-blue-500 transition duration-300 cursor-pointer bg-gray-100 hover:bg-gray-200"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="flex items-center justify-center">
                {(file || fileName) ? (
                  <>
                    {React.createElement(getFileIcon(file ? file.type : ''), {
                      className: "h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2",
                    })}
                    <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[200px]">
                      {fileName || file.name}
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
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => {
                  setComposing(false);
                }}
                placeholder={tags.length === 0 ? "Add a tag... (Enter to add)" : ""}
                className="flex-grow bg-transparent outline-none text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="post-category">
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
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${category === option
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

function PostUpload({ refreshPosts }) {
  const { postId } = useParams();
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 포스트 데이터를 가져오는 함수
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
}

export default PostUpload;