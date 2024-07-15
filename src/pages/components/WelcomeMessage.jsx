import React, { useState, useEffect } from "react";

function WelcomeMessage({ username }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  let fullMessage = "Welcome to Over Engineered blog :)";
  if (username) {
    fullMessage = `Welcome to Over Engineered blog, ${username} :)`;
  }

  useEffect(() => {
    if (message.length < fullMessage.length) {
      setTimeout(() => {
        setMessage(fullMessage.slice(0, message.length + 1));
      }, 100);
    } else {
      setIsTyping(false);
    }
  }, [message, fullMessage]);

  return (
    <h1 className="flex text-2xl whitespace-nowrap overflow-hidden">
      <div className="truncate">{message}</div>
      <div className={`w-0.5 h-8 bg-black animate-blink duration-200`}></div>
    </h1>
  );
}

export default WelcomeMessage;
