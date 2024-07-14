import React from "react";
import ModalImage from "react-modal-image";
import backgroundImage from "@img/background2.png";
import systemImage from "@img/system_stack.png";

export const SystemStack = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center cursor-pointer hover:text-gray-600 transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Website Tech Stack
          </h1>
          <div className="mb-6">
            <ModalImage
              small={systemImage}
              large={systemImage}
              alt="Website Tech Stack"
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
          <p className="text-center text-gray-600 italic">
            Click on the image to zoom in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemStack;
