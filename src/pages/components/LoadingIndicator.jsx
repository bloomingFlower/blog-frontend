import React, { useState, useEffect } from "react";

const LoadingIndicator = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="flex justify-center items-center py-4">
            <svg className="h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <g fill="none" stroke="#FFFFFF" strokeWidth="4">
                    <circle className="animate-doppler-1" cx="50" cy="50" r="6" />
                    <circle className="animate-doppler-2" cx="50" cy="50" r="18" />
                    <circle className="animate-doppler-3" cx="50" cy="50" r="30" />
                </g>
            </svg>
        </div>
    );
};

const styles = `
    @keyframes doppler {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        50% {
            opacity: 0.7;
        }
        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }
    .animate-doppler-1 {
        animation: doppler 2s infinite;
    }
    .animate-doppler-2 {
        animation: doppler 2s infinite 0.5s;
    }
    .animate-doppler-3 {
        animation: doppler 2s infinite 1s;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoadingIndicator;