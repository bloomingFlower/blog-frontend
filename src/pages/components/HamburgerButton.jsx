import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from './AuthContext';

function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickTimes, setClickTimes] = useState([]);
  const navigate = useNavigate();
  const handleMouseOver = () => {
    setIsOpen(true);
  };

  const handleMouseOut = () => {
    setIsOpen(false);
  };
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (clickTimes.length === 3) {
      const timeDifference = clickTimes[2] - clickTimes[0];
      if (timeDifference <= 500) {
        navigate("/admin-login");
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
          onMouseOver={handleMouseOver}
          style={{display: "flex", alignItems: "center"}}
      >
        <button onClick={handleHamburgerClick} className="hover:rotate-180 transform transition duration-200">
          {isOpen ? (
              <svg
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
                className="menu"
                style={{
                  position: "absolute",
                  top: "100%", // 네비바의 높이에 맞게 조절
                  right: "0px",
                  width: "100%", // 화면 좌우로 가득 차게 변경
                  backgroundColor: "rgba(255, 255, 255, 0.7)", // 반투명한 흰색으로 변경
                }}
                onMouseOut={handleMouseOut}
            >
              <Link
                  className="block px-5 py-2 text-black hover:text-blue-500" // 텍스트 색상을 검은색으로 변경
                  style={{fontSize: "15px"}} // 글씨 크기를 더 크게 변경
                  to="/"
                  onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                  className="block px-5 py-2 text-black hover:text-blue-500"
                  style={{fontSize: "15px"}}
                  to="/system-stack"
                  onClick={() => setIsOpen(false)}
              >
                Website Tech Stack
              </Link>
              <Link
                  className="block px-5 py-2 text-black hover:text-blue-500" // 텍스트 색상을 검은색으로 변경
                  style={{fontSize: "15px"}} // 글씨 크기를 더 크게 변경
                  to="/about"
                  onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                  className="block px-5 py-2 text-black hover:text-blue-500" // 텍스트 색상을 검은색으로 변경
                  style={{fontSize: "15px"}} // 글씨 크기를 더 크게 변경
                  to="/post"
                  onClick={() => setIsOpen(false)}
              >
                Post(Rest)
              </Link>
              <Link
                  className="block px-5 py-2 text-black hover:text-blue-500"
                  style={{fontSize: "15px"}}
                  to="/scrap"
                  onClick={() => setIsOpen(false)}
              >
                Scrap(gRPC)
              </Link>
              {isLoggedIn && (
                  <>

                    <Link
                        className="block px-5 py-2 text-black hover:text-blue-500"
                        style={{fontSize: "15px"}}
                        to="/logout"
                        onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </>
              )}
            </div>
        )}
      </div>
  );
}

export default HamburgerButton;
