import React from "react";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background.png";

function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      ><h1 className="text-4xl text-white">Welcome to My Website</h1>
      <p className="text-xl text-white">
        Hello, my name is [Your Name]. I am a [Your Job].
      </p>
      <p className="text-xl text-white">
        Welcome to my website where I showcase my latest work and share about my
        life.
      </p>
    </div>
  );
}

export default Home;
