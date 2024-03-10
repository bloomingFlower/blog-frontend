import React, { useState } from 'react';
import ModalImage from 'react-modal-image';
import backgroundImage from "@img/background2.png";
import systemImage from "@img/system_stack.png";

export const SystemStack = () => {

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-cover bg-no-repeat"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
             }}>
            <div
                className="container mx-auto px-4"
                style={{
                    fontFamily: "PlayfairDisplay, serif",
                }}
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold cursor-pointer"
                        onClick={() => window.location.reload()}>Website Tech Stack</h1>
                </div>
                <div>
                    <ModalImage
                        small={systemImage}
                        medium={systemImage}
                        large={systemImage}
                        alt="Website Tech Stack"
                    />
                    <p>이미지 터치: 확대 보기</p>
                </div>
            </div>
        </div>
    );
};

export default SystemStack;