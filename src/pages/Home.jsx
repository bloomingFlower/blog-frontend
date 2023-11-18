import React from "react";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";
function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        fontFamily: "PlayfairDisplay, serif",
        //fontWeight: "bold",
        //fontSize: "60px",
      }}
    >
      <h1 className="text-4xl">Welcome to My Website</h1>
      <p className="text-xl">
        Hello, my name is Jaeyoung Yun. I am a computer engineer.
      </p>
      <p className="text-xl">
        Welcome to my website where I showcase my latest work and share about my
        life.
      </p>
    </div>
  );
}

export default Home;
