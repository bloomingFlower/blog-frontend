// PostUpload.jsx
import React, { useEffect, useState, useRef } from "react";
import ReactQuill from 'react-quill';
import CreatableSelect from 'react-select/creatable';
import 'react-quill/dist/quill.snow.css';
import Modal from "react-modal";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";

function PostUpload({ setIsUploadModalOpen }) {
    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    }

    const handleAddition = (tag) => {
        // '#' 문자로 태그를 구분하는 로직
        const inputTags = tag.text.split('#').filter(inputTag => inputTag.trim() !== '');
        inputTags.forEach(inputTag => {
            const newTag = { id: inputTag, text: '#' + inputTag }; // 각 태그 문자 앞에 '#' 문자를 붙임
            if (!tags.find(t => t.id === newTag.id)) {
                setTags([...tags, newTag]);
            }
        });
    }
    const handleDrag = (tag, currPos, newPos) => {
        const newTags = [...tags];
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        setTags(newTags);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
            [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const handleUpload = () => {
        // 여기에 업로드 기능을 구현합니다.
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
                    placeholder="Title"
                />
                <div>
                    <ReactQuill className="w-full h-full" value={editorState} onChange={handleInputChange} modules={modules} />
                </div>
            <div>

            <input
                    className="border border-gray-300 p-2 w-full mb-4"
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
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
