import React, { useState } from "react";
import { Helmet } from "react-helmet";
import backgroundImage from "@img/background2.png";

function Section({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
      <button
        className="w-full px-6 py-4 text-left text-lg font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 text-gray-700 bg-white">{children}</div>
      )}
    </div>
  );
}

function About() {
  return (
    <div
      className="min-h-screen bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Helmet>
        <title>About Me</title>
        <meta name="description" content="About me page of my website" />
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          About Me
        </h1>
        <div className="space-y-6">
          <Section title="Education">
            <p></p>
          </Section>
          <Section title="Work Experience">
            <p></p>
          </Section>
          <Section title="Skills">
            <p></p>
          </Section>
          <Section title="Projects">
            <p></p>
          </Section>
          <Section title="Certifications">
            <p></p>
          </Section>
          <Section title="Study">
            <p>
              I am passionate about learning new things. Here, I share my study
              notes and experiences!
            </p>
          </Section>
          <Section title="Travel">
            <p>
              I love to travel and explore new places. Check out my travel
              diaries.
            </p>
          </Section>
          <Section title="Food Reviews">
            <p>
              I enjoy trying out new cuisines and restaurants. Here are some of
              my food reviews.
            </p>
          </Section>
          <Section title="Electronics Reviews">
            <p>
              I love exploring new gadgets and electronics. Here are some of my
              reviews.
            </p>
          </Section>
          <Section title="Economy">
            <p></p>
          </Section>
          <Section title="Others">
            <p></p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default About;
