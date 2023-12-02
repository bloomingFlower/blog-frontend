import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 애플리케이션 로드 시 세션 스토리지에서 isLoggedIn 상태 가져오기
    useEffect(() => {
        const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (storedIsLoggedIn === null) {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(JSON.parse(storedIsLoggedIn));
        }
    }, []);

    // isLoggedIn 상태가 변경될 때마다 세션 스토리지에 저장하기
    useEffect(() => {
        sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};