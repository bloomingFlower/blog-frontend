import React, { useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import backgroundImage from "@img/background2.webp";
import { FaGraduationCap, FaBriefcase, FaCode, FaProjectDiagram, FaCertificate, FaBook, FaPlane, FaUtensils, FaMicrochip, FaChartLine, FaEllipsisH, FaGithub, FaEnvelope, FaLinkedin, FaTwitter, FaBlog } from "react-icons/fa";
import { SiCoursera, SiOrcid } from "react-icons/si";

// Contact & Social Links component
function ContactInfo() {
  const contacts = [
    { icon: <FaEnvelope />, label: "Email", link: "mailto:yourrubber@duck.com" },
    { icon: <FaGithub />, label: "GitHub", link: "https://github.com/bloomingFlower" },
    { icon: <SiOrcid />, label: "ORCID", link: "https://orcid.org/0009-0001-5288-7745" },
    { icon: <SiCoursera />, label: "Coursera", link: "https://www.coursera.org/user/6fc30c5f564982f4134e32b619efef76" },
    // { icon: <FaLinkedin />, label: "LinkedIn", link: "https://www.linkedin.com/in/yourusername" },
    // { icon: <FaTwitter />, label: "Twitter", link: "https://twitter.com/yourusername" },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Contact & Social</h2>
      <div className="grid grid-cols-2 gap-2">
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-sm mr-2">{contact.icon}</span>
            <span className="text-sm">{contact.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// Table of Contents component
function TableOfContents({ sections, scrollTo }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Contents</h2>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.title}>
            <button
              onClick={() => scrollTo(section.title)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Section component
function Section({ title, children, icon }) {
  return (
    <div id={title.replace(/\s+/g, '-').toLowerCase()} className="mb-8">
      <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
        <span className="mr-2 text-gray-600">{icon}</span>
        {title}
      </h2>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

function AboutMe() {
  const sectionData = [
    { title: "Education", icon: <FaGraduationCap /> },
    { title: "Work Experience", icon: <FaBriefcase /> },
    { title: "Skills", icon: <FaCode /> },
    { title: "Projects", icon: <FaProjectDiagram /> },
    { title: "Certifications", icon: <FaCertificate /> },
    { title: "Study", icon: <FaBook /> },
    { title: "Travel", icon: <FaPlane /> },
    { title: "Food Reviews", icon: <FaUtensils /> },
    { title: "Electronics Reviews", icon: <FaMicrochip /> },
    { title: "Economy", icon: <FaChartLine /> },
    { title: "Others", icon: <FaEllipsisH /> },
  ];

  const sectionRefs = useRef({});

  const scrollTo = (title) => {
    const element = sectionRefs.current[title];
    if (element) {
      const navHeight = 60; // nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // if URL has a hash, scroll to that section
    if (window.location.hash) {
      const sectionId = window.location.hash.slice(1);
      const section = sectionData.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === sectionId);
      if (section) {
        setTimeout(() => scrollTo(section.title), 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>About Me</title>
        <meta name="description" content="About me page of my website" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">About Me</h1>

        {/* Add Blog button */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaBlog className="mr-2" />
            블로그 둘러보기
          </Link>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* left sidebar */}
          <div className="w-full md:w-1/3 md:pr-8 mb-8 md:mb-0">
            <div className="md:sticky md:top-20">
              <ContactInfo />
              <TableOfContents sections={sectionData} scrollTo={scrollTo} />
            </div>
          </div>
          {/* right content */}
          <div className="w-full md:w-2/3">
            {sectionData.map((section) => (
              <div key={section.title} ref={el => sectionRefs.current[section.title] = el}>
                <Section
                  title={section.title}
                  icon={section.icon}
                >
                  <p>{/* add content here */}</p>
                </Section>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;