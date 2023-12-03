import React, { useState } from "react";

function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setYear(year + 1);

        setTimeout(() => {
            setYear(new Date().getFullYear());
            setIsClicked(false);
        }, 1000);
    };

    return (
        <div className="text-center py-4">
      <span
          onClick={handleClick}
          className={`transition-all duration-1000 ${isClicked ? "text-red-500 scale-150 rotate-180" : ""}`}
      >
        © {year} JaeyoungYun
      </span>
        </div>
    );
}

export default Footer;