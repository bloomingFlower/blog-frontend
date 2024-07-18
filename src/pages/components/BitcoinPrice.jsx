import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function BitcoinPrice() {
    const [price, setPrice] = useState(null);
    const [countdown, setCountdown] = useState(300); // 5분 = 300초

    useEffect(() => {
        const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/sse`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setPrice(data.price);
            setCountdown(data.countdown);
        };

        eventSource.onerror = (error) => {
            console.error('SSE Error:', error);
            toast.error('Bitcoin Price Update Error');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Bitcoin Current Price</h2>
            {price !== null ? (
                <p className="text-2xl font-semibold mb-1">{formatPrice(price)}</p>
            ) : (
                <p className="text-lg">Loading...</p>
            )}
            <p className="text-sm text-gray-600">
                Next Update: {formatCountdown(countdown)}
            </p>
        </div>
    );
}

export default BitcoinPrice;