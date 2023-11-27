import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import backgroundImage from "@img/background2.png";

function Home() {
    const [text, setText] = useState("");
    const fullText = "Welcome to Our Website :)";

    useEffect(() => {
        let index = 0;
        const intervalId = { id: null };

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
            <h1 className="text-4xl">{text}</h1>
            <p className="text-xl">
                Hello, my name is Jaeyoung Yun. I am a computer engineer.
            </p>
            <p className="text-xl">
                Welcome to my website where I showcase my latest work and share about my
                life.
            </p>
        </div>
    );
}

export default Home;