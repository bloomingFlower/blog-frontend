import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { api } from './api';
import { FaReply, FaTrash, FaPlus } from 'react-icons/fa';
import DefaultAvatar from './DefaultAvatar';
import CommentLoadingIndicator from './CommentLoadingIndicator';
import TextareaAutosize from 'react-textarea-autosize';
import EmojiPicker from 'emoji-picker-react';
import DOMPurify from 'dompurify';

const Comment = ({ comment, onReply, onVote, onDelete, postId, depth = 0 }) => {
    const { user } = useContext(AuthContext);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [replyError, setReplyError] = useState('');
    const [isReplyFocused, setIsReplyFocused] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isReplyBlurred, setIsReplyBlurred] = useState(false);

    const votes = (comment.votes || []).reduce((acc, vote) => {
        if (vote.emoji && vote.emoji !== '0') {
            acc[vote.emoji] = (acc[vote.emoji] || 0) + 1;
        }
        return acc;
    }, {});

    // Validate comment content
    const validateCommentContent = (content) => {
        return content.trim().length > 0 && content.length <= 3000;
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (validateCommentContent(replyContent)) {
            const sanitizedReply = DOMPurify.sanitize(replyContent);
            onReply(comment.ID, sanitizedReply);
            setReplyContent('');
            setShowReplyForm(false);
            setReplyError('');
        } else {
            console.log('replyContent', replyContent);
            setReplyError('Please enter your reply (maximum 3000 characters)');
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
        (user.id === comment.user_id ||
            (user.first_name === "bloomingFlower" && user.id === 6)) &&
        (!comment.children || comment.children.length === 0);

    // Handle emoji click
    const onEmojiClick = async (emojiObject) => {
        setIsVoting(true);
        await onVote(postId, comment.ID, emojiObject.emoji);
        setIsVoting(false);
        setShowEmojiPicker(false);
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

    const handleReplyBlur = () => {
        if (replyContent.trim() === '') {
            setIsReplyBlurred(true);
            setShowReplyForm(false);
            setIsReplyFocused(false);
        }
    };

    // Sanitize comment content
    const sanitizedContent = DOMPurify.sanitize(comment.content);

    return (
        <div className={`border-l-2 border-gray-200 pl-2 sm:pl-4 mb-2 sm:mb-4 ${depth > 0 ? 'ml-2 sm:ml-4' : ''}`}>
            <div className="flex items-start mb-2">
                {comment.user && comment.user.picture ? (
                    <img src={comment.user.picture} alt="User Avatar" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2" />
                ) : (
                    <DefaultAvatar className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                )}
                <div className="flex-grow">
                    <p className={`text-sm sm:text-base ${!comment.user_id ? 'italic text-gray-500' : ''}`}>{displayName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(comment.created_at)}
                        {comment.updated_at !== comment.created_at &&
                            ` (Edited: ${formatDate(comment.updated_at)})`}
                    </p>
                </div>
                {canDelete && (
                    <button
                        onClick={handleDeleteClick}
                        className="text-gray-500 hover:text-gray-700 text-sm sm:text-base ml-2"
                    >
                        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                )}
            </div>
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <p className="mb-2 text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: sanitizedContent }}></p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                        {Object.entries(votes).map(([emoji, count]) => (
                            <button
                                key={emoji}
                                onClick={() => onVote(postId, comment.ID, emoji)}
                                className="inline-flex items-center text-xs sm:text-sm border rounded overflow-hidden px-2 py-1 bg-gray-50 hover:bg-gray-100"
                            >
                                <span>{emoji}</span>
                                <span className="ml-1">{count}</span>
                            </button>
                        ))}
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="text-gray-500 hover:text-gray-700 text-sm sm:text-base flex items-center border rounded px-2 py-1 bg-gray-50 hover:bg-gray-100"
                                disabled={isVoting}
                            >
                                {isVoting ? (
                                    <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                        <path fillRule="evenodd" d="M7 9a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0zm-6.646 4.646a.5.5 0 01.708 0l.646.647.646-.647a.5.5 0 01.708.708l-1 1a.5.5 0 01-.708 0l-1-1a.5.5 0 010-.708z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            {showEmojiPicker && (
                                <div className="absolute top-full left-0 z-10 mt-1">
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {depth === 0 && (
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm flex items-center ml-2 mt-1"
                    >
                        <FaReply className="mr-1" />
                    </button>
                )}
            </div>
            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-2">
                    <div className="relative">
                        <TextareaAutosize
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onFocus={() => {
                                setIsReplyFocused(true);
                                setIsReplyBlurred(false);
                            }}
                            onBlur={handleReplyBlur}
                            className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors duration-300 text-sm sm:text-base resize-none"
                            placeholder="Share your anything with us!"
                            maxLength={3000}
                            minRows={1}
                        />
                        {isReplyFocused && !isReplyBlurred && (
                            <div className="flex justify-end items-center mt-2">
                                <button
                                    type="submit"
                                    className="mr-2 text-blue-500 hover:text-blue-600 text-xs sm:text-sm"
                                    disabled={!validateCommentContent(replyContent)}
                                >
                                    Reply
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReplyContent('');
                                        setIsReplyFocused(false);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    {replyError && <p className="text-red-500 text-xs mt-1">{replyError}</p>}
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [isCommentFocused, setIsCommentFocused] = useState(false);
    const [isCommentBlurred, setIsCommentBlurred] = useState(false);

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
        const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
        return sanitizedContent.trim().length > 0 && content.length <= 3000;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateCommentContent(newComment)) {
            setIsSubmitting(true);
            try {
                const sanitizedComment = DOMPurify.sanitize(newComment);
                const response = await api.post(`/api/v1/comments/${postId}`, {
                    content: sanitizedComment,
                    user_id: user ? user.id : null,
                    votes: []
                });
                setComments([...comments, { ...response.data, votes: [] }]);
                setNewComment('');
                fetchComments();
                setCommentError('');
            } catch (error) {
                console.error('Error posting comment:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCommentError('Please enter your comment (maximum 3000 characters)');
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

    const handleCommentBlur = () => {
        if (newComment.trim() === '') {
            setIsCommentBlurred(true);
            setIsCommentFocused(false);
        }
    };

    return (
        <div className="mt-4 sm:mt-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Comments</h2>
            <form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
                <div className="relative">
                    <TextareaAutosize
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onFocus={() => {
                            setIsCommentFocused(true);
                            setIsCommentBlurred(false);
                        }}
                        onBlur={handleCommentBlur}
                        className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors duration-300 text-sm sm:text-base resize-none"
                        placeholder="Share your anything with us!"
                        maxLength={3000}
                        minRows={1}
                    />
                    {isCommentFocused && !isCommentBlurred && (
                        <div className="flex justify-end items-center mt-2">
                            <button
                                type="submit"
                                className="mr-2 text-blue-500 hover:text-blue-600 text-xs sm:text-sm"
                                disabled={!validateCommentContent(newComment) || isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Comment'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setNewComment('');
                                    setIsCommentFocused(false);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                {commentError && <p className="text-red-500 text-xs mt-1">{commentError}</p>}
            </form>
            {isLoading ? (
                <CommentLoadingIndicator />
            ) : comments.length > 0 ? (
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
            ) : (
                <p className="text-sm sm:text-base">No comments yet.</p>
            )}
        </div>
    );
};

export default Comments;