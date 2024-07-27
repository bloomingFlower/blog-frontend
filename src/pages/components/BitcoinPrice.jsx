import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function BitcoinPrice() {
  const [bitcoinInfo, setBitcoinInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    // Get Bitcoin Price from EventSource
    const eventSource = new EventSource(
      `${process.env.REACT_APP_SSE_API_URL}/sse`
    );

    // Handle connection open event
    eventSource.onopen = () => {
      setConnectionStatus("Connected");
      toast.success("Connected to Bitcoin price updates");
    };

    // Handle message receive event
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "success" && data.data) {
        setBitcoinInfo(data.data);
        setConnectionStatus("Connected");
      } else if (data.status === "waiting") {
        setConnectionStatus("Waiting for data...");
      } else if (data.status === "error") {
        console.error("Error receiving data");
        setConnectionStatus("Error");
        toast.error("Error receiving Bitcoin price updates");
      }
    };

    // Handle error event
    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setConnectionStatus("Reconnecting...");
      toast.error("Connection lost. Attempting to reconnect...");
    };

    // Cleanup on component unmount
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    // UTC time format
    const utcFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // KST time format
    const kstFormatter = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const utcString = utcFormatter.format(date);
    const kstString = kstFormatter.format(date);

    return (
      <>
        <span className="block mb-1">
          <span className="font-semibold">UTC:</span> {utcString}
        </span>
        <span className="block">
          <span className="font-semibold">KST:</span> {kstString}
        </span>
      </>
    );
  };

  const getChangeColor = (change) => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  const formatPercentage = (percentage) => {
    return percentage.toFixed(2);
  };

  const renderPriceChange = (change, percentage) => {
    const color = getChangeColor(change);
    const arrow = change >= 0 ? "▲" : "▼";
    return (
      <span className={`${color} font-bold`}>
        {arrow} {formatPrice(Math.abs(change))} ({formatPercentage(percentage)}
        %)
      </span>
    );
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
          <p className="text-3xl font-semibold mb-1">
            {formatPrice(bitcoinInfo.price)}
          </p>
          <div className="text-sm text-gray-600 mb-2">
            <p className="mb-1">Last updated:</p>
            <div className="text-xs">
              {formatDate(bitcoinInfo.last_updated)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-blue-100 p-2 rounded">
              <p className="font-semibold">24h High</p>
              <p className="text-lg">{formatPrice(bitcoinInfo.high_24h)}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded">
              <p className="font-semibold">24h Low</p>
              <p className="text-lg">{formatPrice(bitcoinInfo.low_24h)}</p>
            </div>
            <div className="col-span-2 bg-gray-100 p-2 rounded">
              <p className="font-semibold">24h Change</p>
              <p className="text-lg">
                {renderPriceChange(
                  bitcoinInfo.price_change_24h,
                  bitcoinInfo.price_change_percentage_24h
                )}
              </p>
            </div>
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
