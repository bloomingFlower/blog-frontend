import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Logout = () => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // 로그아웃 처리
        sessionStorage.clear()
        setIsLoggedIn(false);

        // 로그아웃 처리 후 홈 페이지로 리다이렉트
        navigate('/');
    }, [navigate, setIsLoggedIn]);

    return null;
};

export default Logout;