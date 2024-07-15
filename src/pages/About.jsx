import React, { useState } from "react";
import { Helmet } from "react-helmet";
import backgroundImage from "@img/background2.webp";

function Section({ title, children, isOpen, toggleOpen }) {
  return (
    <div className="mb-4 bg-white bg-opacity-80 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out">
      <button
        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left text-base sm:text-lg font-semibold text-gray-800 hover:bg-gray-100 focus:outline-none flex justify-between items-center"
        onClick={toggleOpen}
      >
        {title}
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 transform transition-transform duration-200 ${
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
        <div className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-gray-700 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

function SocialLinks() {
  const links = [
    {
      name: "GitHub",
      url: "https://github.com/bloomingFlower",
      icon: "github",
    },
    // {
    //   name: "LinkedIn",
    //   url: "https://www.linkedin.com/in/yourusername",
    //   icon: "linkedin",
    // },
  ];

  return (
    <div className="flex justify-center space-x-4 mb-8">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 transition duration-300"
        >
          <span className="sr-only">{link.name}</span>
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            {link.icon === "github" && (
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            )}
            {link.icon === "linkedin" && (
              <path
                fillRule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                clipRule="evenodd"
              />
            )}
            {link.icon === "twitter" && (
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            )}
          </svg>
        </a>
      ))}
    </div>
  );
}

function About() {
  const [sections, setSections] = useState({
    Education: false,
    WorkExperience: false,
    Skills: false,
    Projects: false,
    Certifications: false,
    Study: false,
    Travel: false,
    FoodReviews: false,
    ElectronicsReviews: false,
    Economy: false,
    Others: false,
  });

  const toggleSection = (section) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const expandAll = () => {
    setSections(
      Object.fromEntries(Object.keys(sections).map((key) => [key, true]))
    );
  };

  const collapseAll = () => {
    setSections(
      Object.fromEntries(Object.keys(sections).map((key) => [key, false]))
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Helmet>
        <title>About Me</title>
        <meta name="description" content="About me page of my website" />
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-10">
          About Me
        </h1>
        <SocialLinks />
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={expandAll}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Collapse All
          </button>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <Section
            title="Education"
            isOpen={sections.Education}
            toggleOpen={() => toggleSection("Education")}
          >
            <p></p>
          </Section>
          <Section
            title="Work Experience"
            isOpen={sections.WorkExperience}
            toggleOpen={() => toggleSection("WorkExperience")}
          >
            <p></p>
          </Section>
          <Section
            title="Skills"
            isOpen={sections.Skills}
            toggleOpen={() => toggleSection("Skills")}
          >
            <p></p>
          </Section>
          <Section
            title="Projects"
            isOpen={sections.Projects}
            toggleOpen={() => toggleSection("Projects")}
          >
            <p></p>
          </Section>
          <Section
            title="Certifications"
            isOpen={sections.Certifications}
            toggleOpen={() => toggleSection("Certifications")}
          >
            <p></p>
          </Section>
          <Section
            title="Study"
            isOpen={sections.Study}
            toggleOpen={() => toggleSection("Study")}
          >
            <p>
              I am passionate about learning new things. Here, I share my study
              notes and experiences!
            </p>
          </Section>
          <Section
            title="Travel"
            isOpen={sections.Travel}
            toggleOpen={() => toggleSection("Travel")}
          >
            <p>
              I love to travel and explore new places. Check out my travel
              diaries.
            </p>
          </Section>
          <Section
            title="Food Reviews"
            isOpen={sections.FoodReviews}
            toggleOpen={() => toggleSection("FoodReviews")}
          >
            <p>
              I enjoy trying out new cuisines and restaurants. Here are some of
              my food reviews.
            </p>
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
