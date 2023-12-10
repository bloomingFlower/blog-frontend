import { usePromiseTracker } from 'react-promise-tracker';
import React from "react";

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    console.log("promiseInProgress", promiseInProgress)
    return (
        promiseInProgress &&
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
            <div className="loading-spinner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <circle cx="50" cy="50" fill="none" stroke="#4c51bf" strokeWidth="10" r="35"
                            strokeDasharray="164.93361431346415 56.97787143782138">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s"
                                          values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
                    </circle>
                </svg>
            </div>
        </div>
    );
}

export default LoadingIndicator;