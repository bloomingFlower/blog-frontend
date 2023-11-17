import React from "react";
import "tailwindcss/tailwind.css";

function About() {
  return (
    <div className="p-5 bg-gray-100">
      <h1 className="text-4xl text-gray-800 mb-5">About Me</h1>
      <section className="mb-5">
        <h2 className="text-3xl text-blue-600 mb-2">Study</h2>
        <p className="text-lg text-gray-700 mb-5">
          I am passionate about learning new things. Here, I share my study
          notes and experiences.
        </p>
      </section>
      <section className="mb-5">
        <h2 className="text-3xl text-blue-600 mb-2">Travel</h2>
        <p className="text-lg text-gray-700 mb-5">
          I love to travel and explore new places. Check out my travel diaries.
        </p>
      </section>
      <section className="mb-5">
        <h2 className="text-3xl text-blue-600 mb-2">Food Reviews</h2>
        <p className="text-lg text-gray-700 mb-5">
          I enjoy trying out new cuisines and restaurants. Here are some of my
          food reviews.
        </p>
      </section>
    </div>
  );
}

export default About;
