import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Logout from "./Logout";

function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickTimes, setClickTimes] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleMouseOver = () => {
    setIsOpen(true);
  };

  const handleMouseOut = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (clickTimes.length === 3) {
      const timeDifference = clickTimes[2] - clickTimes[0];
      if (timeDifference <= 500) {
        navigate("/login");
      }
      setClickTimes([]);
    }
  }, [clickTimes, navigate]);

  const handleHamburgerClick = () => {
    setIsOpen(!isOpen);
    setClickTimes((prevTimes) => [...prevTimes.slice(-2), Date.now()]);
  };

  return (
    <div
      className="relative"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <button
        onClick={handleHamburgerClick}
        className="p-1 sm:p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:rotate-180 transform transition duration-200"
        aria-label="Hamburger Menu"
      >
        {isOpen ? (
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        )}
      </button>
      {isOpen && (
        <div
          className="menu absolute top-full right-0 w-51 bg-white shadow-lg rounded-lg overflow-hidden z-50"
          onMouseOut={handleMouseOut}
        >
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/system-stack"
            onClick={() => setIsOpen(false)}
          >
            Website Tech Stack
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/about"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/post"
            onClick={() => setIsOpen(false)}
          >
            RESTful Post Manager (Go+Restful+MySQL)
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/scrap"
            onClick={() => setIsOpen(false)}
          >
            gRPC Bookmark Aggregator (Go+gRPC+PostgreSQL)
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/rust-news"
            onClick={() => setIsOpen(false)}
          >
            Restful Rust News Pipeline (Rust+Kafka+ScyllaDB+Redis)
          </Link>
          <Link
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            to="/bitcoin-price"
            onClick={() => setIsOpen(false)}
          >
            Real-Time BTC Tracker (Rust+SSE+Kafka+Redis)
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                to="/edit-profile"
                onClick={() => setIsOpen(false)}
              >
                Edit Profile
              </Link>
              <Link
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                to="/logout"
                onClick={() => setIsOpen(false)}
              >
                Logout
              </Link>
            </>
          ) : (
            <Link
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              to="/login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default HamburgerButton;
