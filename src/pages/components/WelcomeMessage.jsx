import React, { useState, useEffect, useRef } from "react";

function WelcomeMessage({ username }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const messageRef = useRef(null);

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
    <h1
      ref={messageRef}
      className="flex flex-wrap text-2xl overflow-hidden h-20 items-center justify-center"
    >
      <div className="break-words text-center w-full">
        {message}
        <span className="inline-block w-0.5 h-8 bg-black animate-blink duration-200 ml-1 align-middle"></span>
      </div>
    </h1>
  );
}

export default WelcomeMessage;