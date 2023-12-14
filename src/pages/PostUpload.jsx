// PostUpload.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactQuill, { Quill } from 'react-quill';
import ImageUploader from "quill-image-uploader";
//import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import CreatableSelect from 'react-select/creatable';
import 'react-quill/dist/quill.snow.css';
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import api from "./components/api";
import {trackPromise} from "react-promise-tracker";
import sanitizeHtml from 'sanitize-html';
import {toast} from "react-toastify";

Quill.register('modules/imageUploader', ImageUploader);

function PostUpload({ setIsUploadModalOpen }) {
    const navigate = useNavigate();

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

    const handleUpload = async (e) => {
        e.preventDefault();
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
        formData.append('title', sanitizeHtml(title));
        formData.append('content', cleanContent);
        formData.append('file', file);
        formData.append('tags', JSON.stringify(tags.map(tag => sanitizeHtml(tag.value))));
        try {
            const response = await trackPromise(api.post('/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // 쿠키 전송 설정
            }));

            if (response.status === 200) {
                alert('Post uploaded successfully');
                setIsUploadModalOpen(false);
                navigate(-1);
            } else {
                alert('Failed to upload post');
            }
        } catch (error) {
            console.error('Failed to upload post:', error);
        }
    };

    const handleInputChange = (content) => {
        setIsModified(true);
        setEditorState(content);
    };

    const handleInputTag = (newValue, actionMeta) => {
        if (actionMeta.action === 'create-option') {
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
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
                    options={tags}
                    value={tags}
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
    </div>
  );
}

export default PostUpload;
