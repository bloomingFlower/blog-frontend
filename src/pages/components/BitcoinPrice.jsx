import React, { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";

function BitcoinPrice() {
  const [bitcoinInfo, setBitcoinInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [prevPrice, setPrevPrice] = useState(null);

  const { number } = useSpring({
    from: { number: prevPrice || 0 },
    to: { number: bitcoinInfo?.price || 0 },
    config: { tension: 300, friction: 10 },
  });

  useEffect(() => {
    if (bitcoinInfo?.price) {
      setPrevPrice(bitcoinInfo.price);
    }
  }, [bitcoinInfo?.price]);

  const getSSEApiUrl = () => {
    if (process.env.NODE_ENV === "development") {
      return process.env.REACT_APP_SSE_API_URL;
    }
    return window.ENV.REACT_APP_SSE_API_URL !== "%REACT_APP_SSE_API_URL%"
      ? window.ENV.REACT_APP_SSE_API_URL
      : "";
  };

  useEffect(() => {
    // Get Bitcoin Price from EventSource
    const eventSource = new EventSource(`${getSSEApiUrl()}/sse`);

    // Handle connection open event
    eventSource.onopen = () => {
      setConnectionStatus("Connected");
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
        setConnectionStatus("Error");
      }
    };

    // Handle error event
    eventSource.onerror = (error) => {
      setConnectionStatus("Reconnecting...");
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
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const utcFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const kstFormatter = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return (
      <>
        <span className="block">UTC: {utcFormatter.format(date)}</span>
        <span className="block">KST: {kstFormatter.format(date)}</span>
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
      <span className={`${color} text-sm`}>
        {arrow} {formatPrice(Math.abs(change))} ({percentage.toFixed(2)}%)
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

  const renderPercentChange = (label, change) => {
    const color = change >= 0 ? "text-green-500" : "text-red-500";
    const arrow = change >= 0 ? "▲" : "▼";
    return (
      <div className="bg-blue-50 p-1 rounded">
        <p className="font-semibold">{label}</p>
        <span className={`${color} text-sm`}>
          {arrow} {Math.abs(change).toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-3 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Bitcoin Current Price</h2>
        {bitcoinInfo ? (
          <>
            <animated.p className="text-xl font-semibold mb-1">
              {number.to((n) => formatPrice(n))}
            </animated.p>
            <div className="text-xs text-gray-600 mb-2">
              <p className="mb-1">Last updated</p>
              {formatDate(bitcoinInfo.last_updated)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              {renderPercentChange("1h Change", bitcoinInfo.percent_change_1h)}
              {renderPercentChange(
                "24h Change",
                bitcoinInfo.percent_change_24h
              )}
              {renderPercentChange("7d Change", bitcoinInfo.percent_change_7d)}
              {renderPercentChange(
                "30d Change",
                bitcoinInfo.percent_change_30d
              )}
            </div>
          </>
        ) : (
          <p className="text-sm">Loading...</p>
        )}
        <div className="flex items-center mt-1">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
              connectionStatus
            )}`}
          ></div>
          <p className="text-xs text-gray-600">
            Stream Status: {connectionStatus}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Note: Data updates every 4.5 to 5 minutes due to API restrictions.
        </p>
      </div>
    </div>
  );
}

export default BitcoinPrice;
