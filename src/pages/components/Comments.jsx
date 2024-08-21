import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { api } from './api';
import { FaReply, FaTrash, FaPlus } from 'react-icons/fa';
import DefaultAvatar from './DefaultAvatar';
import LoadingIndicator from './LoadingIndicator';

const Comment = ({ comment, onReply, onVote, onDelete, postId, depth = 0 }) => {
    const { user } = useContext(AuthContext);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [newEmoji, setNewEmoji] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const votes = (comment.votes || []).reduce((acc, vote) => {
        if (vote.emoji && vote.emoji !== '0') {
            acc[vote.emoji] = (acc[vote.emoji] || 0) + 1;
        }
        return acc;
    }, {});

    // Validate comment content
    const validateCommentContent = (content) => {
        return content.length <= 3000;
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (validateCommentContent(replyContent)) {
            onReply(comment.ID, replyContent);
            setReplyContent('');
            setShowReplyForm(false);
        }
    };

    const displayName = comment.user_id ? `${comment.user.first_name} #${comment.user.id}` : 'Anonymous';

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const canDelete = user && user.id &&
        comment.user_id &&
        user.id === comment.user_id &&
        (!comment.children || comment.children.length === 0);

    // Validate emoji input
    const validateEmojiInput = (input) => {
        return input.length <= 20;
    };

    const handleEmojiSubmit = (e) => {
        e.preventDefault();
        if (newEmoji && validateEmojiInput(newEmoji)) {
            onVote(postId, comment.ID, newEmoji);
            setNewEmoji('');
        }
    };

    const handleEmojiChange = (e) => {
        const input = e.target.value;
        if (validateEmojiInput(input)) {
            setNewEmoji(input);
        }
    };

    // Handle delete button click
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        onDelete(comment.ID);
        setShowDeleteModal(false);
    };

    // Handle delete cancellation
    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className={`border-l-2 border-gray-200 pl-2 sm:pl-4 mb-2 sm:mb-4 ${depth > 0 ? 'ml-2 sm:ml-4' : ''}`}>
            <div className="flex items-start mb-2">
                {comment.user && comment.user.picture ? (
                    <img src={comment.user.picture} alt="User Avatar" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2" />
                ) : (
                    <DefaultAvatar className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                )}
                <div className="flex-grow">
                    <p className={`font-semibold text-sm sm:text-base ${!comment.user_id ? 'italic text-gray-500' : ''}`}>{displayName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(comment.created_at)}
                        {comment.updated_at !== comment.created_at &&
                            ` (Edited: ${formatDate(comment.updated_at)})`}
                    </p>
                </div>
                {canDelete && (
                    <button
                        onClick={handleDeleteClick}
                        className="text-red-500 hover:text-red-600 text-sm sm:text-base"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>
            <p className="mb-2 text-sm sm:text-base">{comment.content}</p>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {Object.entries(votes).map(([emoji, count]) => (
                    <button
                        key={emoji}
                        onClick={() => onVote(postId, comment.ID, emoji)}
                        className="inline-flex items-center text-xs sm:text-sm bg-blue-100 hover:bg-blue-200 rounded overflow-hidden"
                    >
                        <span className="px-1 sm:px-2 py-0.5 sm:py-1">{emoji}</span>
                        <span className="bg-blue-200 px-1 sm:px-2 py-0.5 sm:py-1 font-semibold">{count}</span>
                    </button>
                ))}
                <form onSubmit={handleEmojiSubmit} className="inline-flex">
                    <input
                        type="text"
                        value={newEmoji}
                        onChange={handleEmojiChange}
                        placeholder="Add vote"
                        maxLength={20}
                        className="w-20 text-xs sm:text-sm border rounded-l px-1 py-0.5"
                    />
                    <button
                        type="submit"
                        className="text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-r px-2 sm:px-3 py-0.5 sm:py-1"
                        disabled={!validateEmojiInput(newEmoji)}
                    >
                        <FaPlus />
                    </button>
                </form>
            </div>
            {depth === 0 && (
                <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-blue-500 hover:text-blue-600 text-xs sm:text-sm flex items-center mb-2"
                >
                    <FaReply className="mr-1" />
                </button>
            )}
            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="w-full p-2 border rounded text-sm sm:text-base"
                        placeholder="Write your reply... (Max 3000 characters)"
                        maxLength={3000}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{replyContent.length}/3000</span>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm"
                            disabled={!validateCommentContent(replyContent)}
                        >
                            Submit Reply
                        </button>
                    </div>
                </form>
            )}
            {comment.children && comment.children.map((reply) => (
                <Comment
                    key={reply.ID}
                    comment={reply}
                    onReply={onReply}
                    onVote={onVote}
                    onDelete={onDelete}
                    postId={postId}
                    depth={depth + 1}
                />
            ))}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Delete Comment
                            </h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this comment?
                                </p>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleDeleteCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    // Use useCallback to memoize the fetchComments function
    const fetchComments = useCallback(async () => {
        try {
            const response = await api.get(`/api/v1/comments/${postId}`);
            const commentsData = response.data.data || [];
            setComments(commentsData);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        setIsLoading(true);
        fetchComments();
    }, [fetchComments]);

    // Validate comment content
    const validateCommentContent = (content) => {
        return content.length <= 3000;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateCommentContent(newComment)) {
            try {
                const response = await api.post(`/api/v1/comments/${postId}`, {
                    content: newComment,
                    user_id: user ? user.id : null,
                    votes: []
                });
                setComments([...comments, { ...response.data, votes: [] }]);
                setNewComment('');
                fetchComments();
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        }
    };

    const handleReply = async (commentId, content) => {
        try {
            await api.post(`/api/v1/comments/${postId}/${commentId}/replies`, {
                content,
                user_id: user ? user.id : null,
            });
            fetchComments();
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const handleVote = async (postId, commentId, emoji) => {
        try {
            await api.post(`/api/v1/comments/${postId}/${commentId}/vote`, {
                emoji,
                user_id: user ? user.id : null
            });
            fetchComments();
        } catch (error) {
            console.error('Error voting on comment:', error);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await api.delete(`/api/v1/comments/${postId}/${commentId}`);
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="mt-4 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Comments</h2>
            <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded text-sm sm:text-base"
                    placeholder="Write a comment... (Max 3000 characters)"
                    maxLength={3000}
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{newComment.length}/3000</span>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm" disabled={!validateCommentContent(newComment)}>
                        Post Comment
                    </button>
                </div>
            </form>
            {isLoading && (
                <div className="flex justify-center items-center">
                    <LoadingIndicator />
                </div>
            )}
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Comment
                        key={comment.ID || comment.id || `comment-${comment.created_at}`}
                        comment={comment}
                        onReply={handleReply}
                        onVote={handleVote}
                        onDelete={handleDelete}
                        postId={postId}
                    />
                ))
            ) : !isLoading && (
                <p className="text-sm sm:text-base">No comments yet.</p>
            )}
        </div>
    );
};

export default Comments;