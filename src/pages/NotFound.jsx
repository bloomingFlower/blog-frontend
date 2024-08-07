import React from "react";
import "tailwindcss/tailwind.css";
import backgroundImage1 from "@img/404.webp";
import backgroundImage2 from "@img/404_2.webp";

function NotFound() {
  const images = [backgroundImage1, backgroundImage2];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center"
      style={{
        backgroundImage: `url(${randomImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/*<h1 className="text-6xl text-red-600">404</h1>*/}
      {/*<p className="text-2xl text-gray-700">*/}
      {/*  Oops! The page you are looking for does not exist.*/}
      {/*</p>*/}
    </div>
  );
}

export default NotFound;
