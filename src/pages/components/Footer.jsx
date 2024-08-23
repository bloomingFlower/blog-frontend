import React, { useState, useEffect, useRef } from "react";

function Footer({ isSuperMode, toggleSuperMode }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [clickCount, setClickCount] = useState(0);
  const [bgColor, setBgColor] = useState("bg-yellow-500");
  const [fontSize, setFontSize] = useState(12);
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const footerRef = useRef(null);

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
      toggleSuperMode();
    }

    setTimeout(() => {
      setYear(new Date().getFullYear());
      setFontSize(12);
    }, 1000);
  };

  const handleSuperModeToggle = () => {
    toggleSuperMode();
    if (!isSuperMode) {
      setScore((prevScore) => prevScore + 100);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -50;
    const isUpSwipe = distance > 50;
    if (isDownSwipe && isVisible) {
      setIsVisible(false);
    } else if (isUpSwipe && !isVisible) {
      setIsVisible(true);
    }
    setTouchStart(null);
    setTouchEnd(null);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer
      ref={footerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`${isSuperMode
          ? bgColor + " text-white"
          : "bg-white text-gray-600"
        } border-t border-gray-200 transition-all duration-300 rounded-t-2xl shadow-lg fixed bottom-0 left-0 right-0 z-50 ${isVisible ? 'translate-y-0' : 'translate-y-full'
        } py-2 md:py-1`}
      style={{ paddingBottom: '0.5rem' }}
    >
      <div className="container mx-auto px-4 pb-safe">
        <div className="flex justify-center items-center min-h-[2.5rem] md:min-h-[2rem]">
          <span
            onClick={handleClick}
            className={`transition-all duration-1000 ${clickCount > 0 ? "text-red-500 scale-110 rotate-180" : ""
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
  );
}

export default Footer;