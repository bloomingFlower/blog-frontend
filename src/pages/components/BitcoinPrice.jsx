import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function BitcoinPrice() {
  const [bitcoinInfo, setBitcoinInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/sse`);

    eventSource.onopen = () => {
      setConnectionStatus("Connected");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setBitcoinInfo(data);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setConnectionStatus("Reconnecting...");
      toast.error("Bitcoin Price Update Error");
    };

    return () => {
      eventSource.close();
      setConnectionStatus("Disconnected");
    };
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Connected":
        return "bg-green-500";
      case "Connecting...":
      case "Reconnecting...":
        return "bg-yellow-500";
      case "Disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Bitcoin Current Price</h2>
      {bitcoinInfo ? (
        <>
          <p className="text-2xl font-semibold mb-1">
            {formatPrice(bitcoinInfo.price)}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Last updated: {bitcoinInfo.last_updated}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>24h High: {formatPrice(bitcoinInfo.high_24h)}</p>
            <p>24h Low: {formatPrice(bitcoinInfo.low_24h)}</p>
            <p>24h Change: {formatPrice(bitcoinInfo.price_change_24h)}</p>
            <p>
              24h Change %: {bitcoinInfo.price_change_percentage_24h.toFixed(2)}
              %
            </p>
          </div>
        </>
      ) : (
        <p className="text-lg">Loading...</p>
      )}
      <div className="flex items-center mt-2">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(
            connectionStatus
          )}`}
        ></div>
        <p className="text-sm text-gray-600">
          Stream Status: {connectionStatus}
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Note: Updates may be infrequent due to API license restrictions.
      </p>
    </div>
  );
}

export default BitcoinPrice;
