import React from 'react';
import BitcoinPrice from './components/BitcoinPrice';
import backgroundImage from "@img/background2.webp";

function BitcoinPricePage() {
    return (
        <div className="min-h-screen bg-cover py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="max-w-md w-full">
                <BitcoinPrice />
            </div>
        </div>
    );
}

export default BitcoinPricePage;