import React, { useState, useEffect } from "react";

const LoadingIndicator = () => {
    // State to control visibility of the loading indicator
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Set a timeout to show the loading indicator after 0.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 700);

        // Clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this effect runs once on mount

    // If not visible, render nothing
    if (!isVisible) return null;

    return (
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 border-t-2 border-b-2 border-white"></div>
    );
};

export default LoadingIndicator;