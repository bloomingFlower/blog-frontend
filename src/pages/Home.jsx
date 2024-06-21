import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";
import WelcomeMessage from "./components/WelcomMessage";

function Home() {
    const [setText] = useState("");
    const [username, setUsername] = useState(""); // 로그인한 사용자의 아이디를 저장할 상태 생성

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        let index = 0;
        const intervalId = { id: null };

        let fullText;
        if (storedUsername) {
            fullText = `Welcome to Over engineered, ${storedUsername} :)`; // 로그인한 사용자의 아이디를 fullText에 추가
        } else {
            fullText = `Welcome to Over engineered :)`;
        }
        const startInterval = () => {
            intervalId.id = setInterval(() => {
                if (index < fullText.length) {
                    setText((prevText) => prevText + fullText[index++]);
                    if (fullText[index] === ' ') {
                        clearInterval(intervalId.id);
                        setTimeout(startInterval, 0);
                    }
                } else {
                    clearInterval(intervalId.id);
                }
            }, 50);
        };

        startInterval();

        return () => clearInterval(intervalId.id);
    }, []);

    return (
        <div
            className="flex flex-col items-center justify-center h-screen text-center bg-center bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                fontFamily: "PlayfairDisplay, serif",
            }}
        >
            <WelcomeMessage username={username} />
            <p className="text-base">
                Hello, my name is Jaeyoung Yun. I am a computer engineer.
            </p>
            <p className="text-base">
                Welcome to my website where I showcase my latest work and share about my
                life.
            </p>
        </div>
    );
}

export default Home;