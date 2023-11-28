import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";

function Section({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
      <section className="mb-5">
        <h2
            className="text-3xl text-blue-600 mb-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </h2>
        <div className={`text-lg mb-5 ${isOpen ? "text-gray-500 bg-gray-500" : "text-gray-700"}`}>
          {children}
        </div>
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
      <Helmet>
        <title>About Me</title>
        <meta name="description" content="About me page of my website" />
      </Helmet>
      <div className="p-5 bg-white bg-opacity-50 rounded-lg">
        <h1 className="text-4xl text-gray-800 mb-5">About Me</h1>
        <Section title="Education">
          <p>Computer Engineering, University of XYZ, 2015-2019</p>
        </Section>
        <Section title="Work Experience">
          <p>Software Engineer at ABC Corp, 2019-Present</p>
        </Section>
        <Section title="Skills">
          <p>JavaScript, React, Node.js, Python, SQL</p>
        </Section>
        <Section title="Projects">
          <p>Project 1: Description</p>
          <p>Project 2: Description</p>
        </Section>
        <Section title="Certifications">
          <p>Certification 1: Description</p>
          <p>Certification 2: Description</p>
        </Section>
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
