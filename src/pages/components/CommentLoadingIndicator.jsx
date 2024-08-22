import React from 'react';

const CommentLoadingIndicator = () => {
    return (
        <div className="flex items-center justify-center space-x-2 my-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
    );
};

export default CommentLoadingIndicator;