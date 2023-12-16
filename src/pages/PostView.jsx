// PostView.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./components/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from 'react-modal';
import {trackPromise} from "react-promise-tracker";
import LoadingIndicator from "./components/LoadingIndicator";
import {toast} from "react-toastify";

Modal.setAppElement('#root'); // Add this line

function PostView({ postId, setIsPostViewModalOpen, setEditingPostId, setIsUploadModalOpen }) {
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await trackPromise(api.get(`/api/post/${postId}`));
                if (response.data.data) {
                    setPost(response.data.data);
                } else {
                    throw new Error('Post not found');
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
                navigate('/error');
            }
        };

        fetchPost();
    }, [postId, navigate]);

    if (!post) {
        return <LoadingIndicator/>;
    }
    const handleEditClick = () => {
        setIsPostViewModalOpen(false); // 현재 모달을 닫습니다.
        setEditingPostId(postId); // 편집 중인 포스트의 ID를 설정합니다.
        setIsUploadModalOpen(true); // PostUpload 모달을 엽니다.
    };

    const handleHideClick = async () => {
        try {
            // 서버에 요청을 보내어 포스트의 숨김 상태를 업데이트
            await trackPromise(api.put(`/api/post/${postId}/hide`));
            toast.success('Post hidden successfully');
            window.location.reload(); // 페이지를 다시 로드합니다.
        } catch (error) {
            toast.error('Failed to hide post:', error);
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => setIsPostViewModalOpen(false)}
            shouldCloseOnOverlayClick={true}
            contentLabel="Post View"
            className="max-w-5xl mx-auto mt-20 mb-20 bg-white rounded-lg overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={{
                content: {
                    width: '80%', // 원하는 너비로 설정
                    margin: 'auto', // 모달을 화면 중앙에 배치
                }
            }}
        >
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">{post.title}</h2>
                <ReactQuill
                    value={post.content}
                    readOnly={true}
                    theme="snow"
                    modules={{toolbar: false}}
                />
                <div className="mt-4 flex flex-wrap">
                    {post.tags.split(',').map((tag, index) => (
                        <span
                            className="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                            key={index}>
                           #{tag.trim()}
                         </span>
                    ))}
                </div>
                {post.file && (
                    <a href={post.file} download={post.file.split('/').pop()}
                       className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {post.file.split('/').pop()}
                    </a>
                )}
                <div className="flex justify-between space-x-4">
                    <button className="w-1/2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleEditClick}>Edit Post
                    </button>
                    <button
                        className="w-1/2 mt-4 bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleHideClick}
                    >
                        {post.hidden ? '숨김 해제' : '숨김'}
                    </button>
                    <button className="w-1/2 mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setIsPostViewModalOpen(false)}>Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default PostView;