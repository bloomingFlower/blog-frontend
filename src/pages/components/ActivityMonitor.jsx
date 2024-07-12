import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30분

function ActivityMonitor({ onTimeUpdate }) {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);
    const [timeLeft, setTimeLeft] = useState(INACTIVITY_TIMEOUT);

    const resetTimer = useCallback(() => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        setTimeLeft(INACTIVITY_TIMEOUT);
        timeoutId = setTimeout(logout, INACTIVITY_TIMEOUT);
        intervalId = setInterval(() => {
            setTimeLeft((prevTime) => {
                const newTime = prevTime - 1000;
                onTimeUpdate(Math.max(newTime, 0));
                return newTime;
            });
        }, 1000);
    }, [onTimeUpdate]);

    const logout = () => {
        setIsLoggedIn(false);
        sessionStorage.clear();
        navigate('/');
    };

    // 사용자 활동 감지
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => {
        document.addEventListener(event, resetTimer);
    });

    let timeoutId;
    let intervalId;

    useEffect(() => {
        resetTimer(); // 초기 타이머 설정

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
            activityEvents.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [resetTimer]);

    return null;
}

export default ActivityMonitor;