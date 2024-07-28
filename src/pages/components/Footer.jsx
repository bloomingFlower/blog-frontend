import React, { useState, useEffect } from "react";

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [clickCount, setClickCount] = useState(0);
  const [isSuperMode, setIsSuperMode] = useState(false);
  const [bgColor, setBgColor] = useState("bg-yellow-500");
  const [fontSize, setFontSize] = useState(12);
  const [score, setScore] = useState(0);

  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    setYear(year + 1);
    setFontSize((prevSize) => prevSize + 1);
    setScore((prevScore) => prevScore + 10);

    if (clickCount >= 4) {
      setIsSuperMode(true);
    }

    setTimeout(() => {
      setYear(new Date().getFullYear());
      setFontSize(12);
    }, 1000);
  };

  const handleSuperModeToggle = () => {
    setIsSuperMode(!isSuperMode);
    if (!isSuperMode) {
      setScore((prevScore) => prevScore + 100);
    }
  };

  useEffect(() => {
    let timer;
    if (isSuperMode) {
      timer = setInterval(() => {
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        setBgColor(newColor);
        setScore((prevScore) => prevScore + 1);
      }, 200);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isSuperMode]);

  return (
    <>
      <footer
        className={`${
          isSuperMode
            ? bgColor + " text-white"
            : "bg-white bg-opacity-90 text-gray-600"
        } border-t border-gray-200 transition-all duration-300`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-8">
            <span
              onClick={handleClick}
              className={`transition-all duration-1000 ${
                clickCount > 0 ? "text-red-500 scale-110 rotate-180" : ""
              }`}
              style={{ fontSize: `${fontSize}px`, cursor: "pointer" }}
            >
              © {year} JaeyoungYun
            </span>
            {isSuperMode && (
              <button
                onClick={handleSuperModeToggle}
                className="ml-4 px-2 bg-red-500 text-white rounded text-xs animate-pulse"
              >
                SUPER MODE {isSuperMode ? "OFF" : "ON"}
              </button>
            )}
            <span className="ml-4 text-xs font-bold">SCORE: {score}</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
