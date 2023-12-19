import React, { useState, useEffect } from "react";

function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [isClicked, setIsClicked] = useState(false);
    const [isSuperMode, setIsSuperMode] = useState(false);
    const [bgColor, setBgColor] = useState("bg-yellow-500");
    const [fontSize, setFontSize] = useState(12); // 글자 크기 상태 추가
    let originalFontSize = 12; // handleClick 함수 바깥에 선언

    const colors = ["bg-red-500", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"];

    const handleClick = () => {
        setIsClicked(true);
        setYear(year + 1);
        originalFontSize = fontSize; // 글자 크기 증가 전에 originalFontSize 업데이트
        setFontSize(fontSize + 1);

        if (year >= new Date().getFullYear() + 7) {
            setIsSuperMode(true);
        }

        setTimeout(() => {
            setYear(new Date().getFullYear());
            setIsClicked(false);
            setFontSize(originalFontSize);
        }, 1000);
    };

    const handleSuperModeToggle = () => {
        setIsSuperMode(!isSuperMode);
    };

    useEffect(() => {
        let timer;
        if (isSuperMode) {
            timer = setInterval(() => {
                setBgColor(colors[Math.floor(Math.random() * colors.length)]);
            }, 200);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isSuperMode, colors]);

    return (
        <div className={`text-center py-1 ${isSuperMode ? bgColor + " text-white" : ""}`}>
      <span
          onClick={handleClick}
          className={`transition-all duration-1000 ${isClicked ? "text-red-500 scale-150 rotate-180" : ""}`}
          style={{ fontSize: `${fontSize}px` }} // 글자 크기 적용
      >
        © {year} JaeyoungYun
      </span>
            {isSuperMode && (
                <button onClick={handleSuperModeToggle} className="ml-4 px-2 py-1 bg-red-500 text-white rounded">슈퍼모드 해제</button>
            )}
        </div>
    );
}

export default Footer;