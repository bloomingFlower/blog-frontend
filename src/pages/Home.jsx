import React, { useEffect, useState, useContext } from "react";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.webp";
import WelcomeMessage from "./components/WelcomeMessage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HamburgerContext } from "../App"; // Import the context

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.5 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

function Home() {
  const [username, setUsername] = useState("");
  const { isHamburgerOpen, toggleHamburger } = useContext(HamburgerContext); // Use the context

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Function to close the hamburger menu
  const closeHamburgerMenu = () => {
    if (isHamburgerOpen) {
      toggleHamburger();
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center bg-center bg-cover bg-no-repeat px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
        fontFamily: "PlayfairDisplay, serif",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl w-full bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-2xl">
        <motion.div variants={itemVariants}>
          <WelcomeMessage username={username} />
        </motion.div>
        <motion.p
          className="text-sm sm:text-base md:text-lg mb-4 text-gray-800"
          variants={itemVariants}
        >
          Hello, my name is Jaeyoung Yun. I am a computer engineer.
          <br />
          Welcome to my website where I showcase my latest work and share about my life.
        </motion.p>
        <motion.div
          className="flex flex-row justify-center gap-2 w-full"
          variants={itemVariants}
        >
          <Link to="/post" className="btn-primary text-xs sm:text-sm" onClick={closeHamburgerMenu}>Our Blog</Link>
          <Link to="/system-stack" className="btn-secondary text-xs sm:text-sm" onClick={closeHamburgerMenu}>System Stack</Link>
          <button onClick={toggleHamburger} className="btn-tertiary text-xs sm:text-sm">
            More Menu
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;