import React from 'react';

const DefaultAvatar = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="12" cy="12" r="12" fill="#E2E8F0" />
            <circle cx="12" cy="10" r="4" fill="#94A3B8" />
            <path
                d="M4 20.5C4 16.9101 7.58172 14 12 14C16.4183 14 20 16.9101 20 20.5C20 21.3284 19.3284 22 18.5 22H5.5C4.67157 22 4 21.3284 4 20.5Z"
                fill="#94A3B8"
            />
        </svg>
    );
};

export default DefaultAvatar;