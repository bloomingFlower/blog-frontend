import React, { useState, useEffect } from 'react';

function WelcomeMessage({ username }) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    let fullMessage = 'Welcome to Our Website :)'; // 원래 메시지 입니다.
    if (username) {
        fullMessage = `Welcome to Our Website, ${username} :)`; // 로그인한 사용자의 아이디를 fullText에 추가
    }
    useEffect(() => {
        if (message.length < fullMessage.length) {
            setTimeout(() => {
                setMessage(fullMessage.slice(0, message.length + 1));
            }, 100); // Adjust typing speed here
        } else {
            setIsTyping(false);
        }
    }, [message]);

    return (
        <h1 className="flex text-3xl">
            <div>{message}</div>
            <div className={`w-0.5 h-8 bg-black animate-blink duration-200 `}></div>        </h1>
    );
}

export default WelcomeMessage;