import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";

function Section({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-5">
      <h2
        className="text-3xl text-blue-600 mb-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </h2>
      {isOpen && <div className="text-lg text-gray-700 mb-5">{children}</div>}
    </section>
  );
}

function About() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="p-5 bg-white bg-opacity-50 rounded-lg">
        <h1 className="text-4xl text-gray-800 mb-5">About Me</h1>
        <Section title="Study">
          I am passionate about learning new things. Here, I share my study
          notes and experiences!
        </Section>
        <Section title="Travel">
          I love to travel and explore new places. Check out my travel diaries.
        </Section>
        <Section title="Food Reviews">
          I enjoy trying out new cuisines and restaurants. Here are some of my
          food reviews.
        </Section>
        <Section title="Electronics Reviews">
          I love exploring new gadgets and electronics. Here are some of my
          reviews.
        </Section>
        <Section title="Economy">
          I am interested in economic trends and developments. Here are my
          thoughts and analyses.
        </Section>
        <Section title="Others">
          Here are some other topics that I am interested in.
        </Section>
      </div>
    </div>
  );
}

export default About;
