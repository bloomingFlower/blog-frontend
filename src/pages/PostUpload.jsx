// PostUpload.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactQuill, { Quill } from 'react-quill';
import ImageUploader from "quill-image-uploader";
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import CreatableSelect from 'react-select/creatable';
import 'react-quill/dist/quill.snow.css';
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import api from "./components/api";
import {trackPromise} from "react-promise-tracker";
import sanitizeHtml from 'sanitize-html';
import {toast} from "react-toastify";

Quill.register('modules/imageUploader', ImageUploader);

function PostUpload({ setIsUploadModalOpen, postId }) {
    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState("");
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const quillRef = useRef(); // Quill 인스턴스에 접근하기 위한 ref

    const modules = useMemo(() => {
        return {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
            [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
            ['link', 'image', 'video'],
            ['clean']
        ],
        imageUploader: {
            upload: file => {
                try {
                    return new Promise((resolve, reject) => {
                        if (!file) {
                            toast.error("No file selected");
                            return;
                        }
                        const formData = new FormData();
                        formData.append("image", file);
                        api({
                            url: "http://localhost:8008/api/upload-img",
                            method: "POST",
                            data: formData,
                            withCredentials: true,
                        })
                        .then(response => {
                            resolve(response.data.url);
                        })
                        .catch(error => {
                            reject("Upload failed");
                        });
                    });
                } catch (error) {
                    toast("Error in imageUploader:", error);
                }
            }
        }
        }
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await trackPromise(api.get(`/api/post/${postId}`));
                if (response.data.data) {
                    setTitle(response.data.data.title);
                    setEditorState(response.data.data.content);
                    setTags(response.data.data.tags.split(',').map(tag => ({value: tag, label: tag})) || []);
                    setFile(response.data.data.file);
                } else {
                    throw new Error('Post not found');
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
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
            toast.error('Title or content cannot be empty');
            return;
        }

        // HTML Sanitization
        const cleanContent = sanitizeHtml(editorState, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'p', 'b', 'i', 'u', 's', 'a', 'br', 'video']),
            allowedAttributes: {
                a: ['href', 'target'],
                img: ['src', 'alt'],
                video: ['src', 'controls', 'autoplay', 'muted', 'loop', 'width', 'height'],
            }
        });
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', cleanContent);
        const tagValues = tags.map(tag => tag.value).join(',');        console.log('tags', tagValues);
        formData.append('tags', tagValues);
        if (file) {
            formData.append('file', file);
        }
        try {
            if (postId) {
                // If postId is provided, update the existing post
                const response = await trackPromise(api.put(`/api/post/${postId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }));
                if (response.status === 200) {
                    toast.success('Post updated successfully');
                    setIsUploadModalOpen(false);
                    window.location.reload();
                } else {
                    alert('Failed to upload post');
                }
            } else {
                const response = await trackPromise(api.post('/api/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }));

                if (response.status === 200) {
                    toast.success('Post uploaded successfully');
                    setIsUploadModalOpen(false);
                    window.location.reload();
                } else {
                    alert('Failed to upload post');
                }
            }
        } catch (error) {
            toast.error('Failed to upload post:', error);
        }
    };

    const handleInputChange = (content) => {
        setIsModified(true);
        setEditorState(content);
    };

    const handleInputTag = (newValue, actionMeta) => {
        if (actionMeta.action === 'remove-value') {
            setTags(newValue);
        } else if (actionMeta.action === 'create-option') {
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
            className="max-w-5xl mx-auto mt-20 mb-20 bg-white rounded-lg overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={{
                content: {
                    width: '80%', // 원하는 너비로 설정
                    margin: 'auto', // 모달을 화면 중앙에 배치
                }
            }}
        >
            <div className="bg-gray-100 p-8 rounded shadow-md max-w-[97%] max-h-[98%] m-4 overflow-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Upload a Post</h2>
                <input
                    ref={titleRef}
                    className="border border-gray-300 p-2 w-full mb-4"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요"
                />
                <div>
                    <ReactQuill
                        ref={quillRef}
                        value={editorState}
                        onChange={setEditorState || handleInputChange}
                        modules={modules}
                        theme = "snow"
                        placeholder = "내용을 입력해주세요"
                    />
                </div>
                <div>

                    <input
                        className="border border-gray-300 p-2 w-full mb-4"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>
                <CreatableSelect
                    className="mb-4"
                    isMulti
                    placeholder={'#태그를 입력하세요'}
                    onChange={handleInputTag}
                    options={tags.map((tag) => ({ value: tag.value, label: tag.label }))}
                    value={tags.map((tag) => ({ value: tag.value, label: tag.label }))}
                    styles={{
                        dropdownIndicator: base => ({
                            ...base,
                            display: "none"
                        }),
                        clearIndicator: base => ({
                            ...base,
                            display: "none"
                        })
                    }}
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
    </Modal>
  );
}

export default PostUpload;
