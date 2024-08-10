import React from "react";
import BitcoinPrice from "./components/BitcoinPrice";
import backgroundImage from "@img/background2.webp";
import { FaBitcoin, FaRust, FaBolt } from "react-icons/fa";

function BitcoinPricePage() {
  return (
    <div
      className="min-h-screen bg-cover py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md w-full mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">
          Real-Time Bitcoin Price Tracker
        </h1>
        <div className="bg-white bg-opacity-80 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <FaBitcoin className="text-orange-500 mr-2" />
            <FaRust className="text-brown-500 mr-2" />
            <FaBolt className="text-yellow-500 mr-2" />
          </div>
          <p className="text-sm text-gray-700 text-center">
            This high-performance Bitcoin price tracker is built with Rust,
            utilizing Server-Sent Events (SSE) for real-time updates, Apache
            Kafka for event streaming, and Redis for ultra-fast caching.
          </p>
        </div>
      </div>
      <div className="max-w-md w-full">
        <BitcoinPrice />
      </div>
    </div>
  );
}

export default BitcoinPricePage;
