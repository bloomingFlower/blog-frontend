// PostView.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./components/api";
import { AuthContext } from "./components/AuthContext";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from 'react-modal';
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "./components/LoadingIndicator";
import { toast } from "react-toastify";

Modal.setAppElement('#root'); // Add this line

function PostView({ postId, setIsPostViewModalOpen, setEditingPostId, setIsUploadModalOpen }) {
    const [post, setPost] = useState(null);
    const navigate = useNavigate();
    // const jwtCookie = document.cookie
    //     .split('; ')
    //     .find(row => row.startsWith('jwt='));
    //
    // if (jwtCookie) {
    //     const jwt = jwtCookie.split('=')[1];
    // } else {
    //     console.error('JWT 쿠키가 없습니다.');
    // }
    // // 세션 생성
    // const jwt = document.cookie
    //     .split('; ')
    //     .find(row => row.startsWith('jwt='))
    //     .split('=')[1];
    // if (jwt === undefined) {
    //     toast.error("jwt is undefined");
    // }
    const { isLoggedIn } = useContext(AuthContext);
    const { jwt } = useContext(AuthContext);
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

    // useEffect(() => {
    //     const fetchToken = async () => {
    //         if (post) {
    //             const script1 = document.createElement('script');
    //             // TODO https 설정 필요(nginx) https://www.devbitsandbytes.com/setting-up-remark42-from-scratch/ 참고
    //             script1.text = `
    //                 var remark_config = {
    //                     host: 'http://129.154.213.18:8088',
    //                     site_id: '${postId}',
    //                     components: ['embed'],
    //                     token: 'Bearer ${jwt}'
    //                 };
    //             `;
    //             document.body.appendChild(script1);
    //
    //             const script2 = document.createElement('script');
    //             script2.text = `
    //                 !function(e,n){
    //                     for(var o=0;o<e.length;o++){
    //                         var r=n.createElement("script"),c=".js",d=n.head||n.body;
    //                         "noModule"in r?(r.type="module",c=".mjs"):r.async=!0;
    //                         r.defer=!0,r.src=remark_config.host+"/web/"+e[o]+c,d.appendChild(r)
    //                     }
    //                 }(remark_config.components||["embed"],document);
    //             `;
    //             script2.async = true;
    //             document.body.appendChild(script2);
    //
    //             return () => {
    //                 document.body.removeChild(script1);
    //                 document.body.removeChild(script2);
    //             };
    //         }
    //     };
    //
    //     fetchToken().then(r =>  console.log("r: " + r));
    //
    // }, [postId, post, jwt]);


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
            toast.warning('Please log in to hide posts');
            return;
        }
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
            className="w-11/12 max-w-4xl mx-auto my-10 bg-white rounded-lg shadow-xl overflow-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
            style={{
                content: {
                    maxHeight: '90vh',
                }
            }}
        >
            <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">{post.title}</h2>
                <div className="mb-6">
                    <ReactQuill
                        value={post.content}
                        readOnly={true}
                        theme="snow"
                        modules={{ toolbar: false }}
                    />
                </div>
                <div className="mb-6 flex flex-wrap">
                    {post.tags.split(',').map((tag, index) => (
                        <span
                            className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                            key={index}>
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
                {post.file && (
                    <a href={post.file} download={post.file.split('/').pop()}
                        className="mb-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                        Download: {post.file.split('/').pop()}
                    </a>
                )}
                <div id="remark42" className="mb-6"></div>
                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <button className="w-full md:w-1/3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        onClick={handleEditClick}>Edit Post
                    </button>
                    {isLoggedIn && (
                        <button
                            className="w-full md:w-1/3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                            onClick={handleHideClick}
                        >
                            {post.hidden ? '숨김 해제' : '숨김'}
                        </button>
                    )}
                    <button className="w-full md:w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        onClick={() => setIsPostViewModalOpen(false)}>Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default PostView;