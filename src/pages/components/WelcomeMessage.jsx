import React, { useState, useEffect } from "react";

function WelcomeMessage({ username }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const fullMessage = username
      ? `Welcome to Over Engineered blog, ${username} :)`
      : "Welcome to Over Engineered blog :)";

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullMessage.length) {
        setMessage(fullMessage.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [username]);

  return (
    <h1 className="flex text-2xl whitespace-nowrap overflow-hidden">
      <div className="truncate">{message}</div>
      <div className={`w-0.5 h-8 bg-black animate-blink duration-200`}></div>
    </h1>
  );
}

export default WelcomeMessage;