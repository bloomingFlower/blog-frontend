import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30분

function ActivityMonitor({ onTimeUpdate }) {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const logout = () => {
      setIsLoggedIn(false);
      sessionStorage.clear();
      navigate("/");
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      let timeLeft = INACTIVITY_TIMEOUT;
      onTimeUpdate(timeLeft);

      timeoutRef.current = setTimeout(logout, INACTIVITY_TIMEOUT);
      intervalRef.current = setInterval(() => {
        timeLeft -= 1000;
        onTimeUpdate(Math.max(timeLeft, 0));
        if (timeLeft <= 0) clearInterval(intervalRef.current);
      }, 1000);
    };

    const handleActivity = () => {
      resetTimer();
    };

    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    resetTimer(); // 초기 타이머 설정

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate, setIsLoggedIn, onTimeUpdate]);

  return null;
}

export default ActivityMonitor;
