import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/404_2.webp";

function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  const progressWidth = `${(countdown / 10) * 100}%`;

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-80 p-4 sm:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-2 sm:mb-4">
          Oops! 404
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 mb-4 sm:mb-6">
          Lost your way? Don't worry!
        </p>
        <p className="text-lg sm:text-xl text-gray-600 mb-4">
          We'll safely guide you home in {countdown} seconds.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: progressWidth }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
