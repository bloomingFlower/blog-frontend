import React from "react";
import "tailwindcss/tailwind.css";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl text-red-600">404</h1>
      <p className="text-2xl text-gray-700">
        Oops! The page you are looking for does not exist.
      </p>
    </div>
  );
}

export default NotFound;
