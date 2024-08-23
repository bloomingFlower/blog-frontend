import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "./AuthContext";

function WelcomeMessage() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const messageRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fullMessage = user
      ? `Welcome to Over Engineered blog, ${user.first_name || 'Anonymous'} :)`
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
  }, [user]);

  return (
    <h1
      ref={messageRef}
      className="flex flex-wrap text-lg sm:text-xl md:text-2xl overflow-hidden h-16 sm:h-20 items-center justify-center"
    >
      <div className="break-words text-center w-full">
        {message}
        <span className="inline-block w-0.5 h-6 sm:h-8 bg-black animate-blink duration-200 ml-1 align-middle"></span>
      </div>
    </h1>
  );
}

export default WelcomeMessage;