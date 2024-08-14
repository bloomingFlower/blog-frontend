import React, { useEffect, useContext, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30분

function ActivityMonitor({ onTimeUpdate, isSuperMode, setSuperMode }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(INACTIVITY_TIMEOUT);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const handleInactivityLogout = useCallback(() => {
    logout(); // AuthContext의 logout 함수 호출
    setSuperMode(false); // 슈퍼모드 해제
    navigate("/", { replace: true });
  }, [logout, navigate, setSuperMode]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeLeft(INACTIVITY_TIMEOUT);

    timeoutRef.current = setTimeout(handleInactivityLogout, INACTIVITY_TIMEOUT);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1000;
        const updatedTime = Math.max(newTime, 0);
        if (updatedTime <= 0) {
          clearInterval(intervalRef.current);
          handleInactivityLogout();
        }
        return updatedTime;
      });
    }, isSuperMode ? 10 : 1000);
  }, [isSuperMode, handleInactivityLogout]);

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  useEffect(() => {
    resetTimer();
  }, [isSuperMode, resetTimer]);

  // timeLeft가 변경될 때마다 onTimeUpdate를 호출합니다.
  useEffect(() => {
    onTimeUpdate(timeLeft);
  }, [timeLeft, onTimeUpdate]);

  return null;
}

export default React.memo(ActivityMonitor);