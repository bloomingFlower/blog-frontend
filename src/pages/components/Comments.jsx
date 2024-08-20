import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { api } from './api';
import { FaReply, FaThumbsUp, FaThumbsDown, FaSmile } from 'react-icons/fa';
import DefaultAvatar from './DefaultAvatar';

// Define the list of emojis
const emojis = ['👍', '👎', '😄', '😢', '😮', '❤️'];

const Comment = ({ comment, onReply, onVote, postId }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const handleReplySubmit = (e) => {
        e.preventDefault();
        onReply(comment.id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
    };

    // Use an empty object if votes is undefined
    const votes = comment.votes || {};

    return (
        <div className="border-l-2 border-gray-200 pl-4 mb-4">
            <div className="flex items-start mb-2">
                {comment.user && comment.user.avatar ? (
                    <img src={comment.user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
                ) : (
                    <DefaultAvatar className="w-8 h-8 mr-2" />
                )}
                <div>
                    <p className="font-semibold">{comment.user?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
            </div>
            <p className="mb-2">{comment.content}</p>
            <div className="flex space-x-2 mb-2">
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        onClick={() => onVote(postId, comment.id, emoji)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 rounded px-2 py-1"
                    >
                        {emoji} {votes[emoji] || 0}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
            >
                <FaReply className="mr-1" /> Reply
            </button>
            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Write your reply..."
                    />
                    <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                        Submit Reply
                    </button>
                </form>
            )}
            {comment.replies && comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} onReply={onReply} onVote={onVote} postId={postId} />
            ))}
        </div>
    );
};

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/api/v1/comments/${postId}`);
            // Check the structure of the server response and handle it appropriately
            const commentsData = Array.isArray(response.data) ? response.data : response.data.comments || [];
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]); // Set comments to an empty array if there's an error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("User: ", user.id);
            const response = await api.post(`/api/v1/comments/${postId}`, {
                content: newComment,
                userId: user ? user.id : null
            });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleReply = async (commentId, content) => {
        try {
            await api.post(`/api/v1/comments/${postId}/${commentId}/replies`, {
                content,
                userId: user ? user.id : null
            });
            fetchComments(); // Refresh the comment list to include the new reply
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const handleVote = async (postId, commentId, emoji) => {
        try {
            await api.post(`/api/v1/comments/${postId}/${commentId}/vote`, { emoji });
            fetchComments(); // Refresh the comment list after voting
        } catch (error) {
            console.error('Error voting on comment:', error);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Write a comment..."
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                    Post Comment
                </button>
            </form>
            {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} onReply={handleReply} onVote={handleVote} postId={postId} />
                ))
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
};

export default Comments;