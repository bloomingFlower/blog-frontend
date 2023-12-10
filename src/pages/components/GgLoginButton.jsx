import React from 'react';
import axios from 'axios';
import {trackPromise} from "react-promise-tracker";
import api from "./api";

function GgLoginButton() {
    const handleLogin = async () => {
        // 1. 사용자를 제공자의 로그인 페이지로 리다이렉트
        window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=profile';

        // 2. 사용자가 로그인하면 제공자는 사용자를 앱으로 다시 리다이렉트하고, 이때 URL에 인증 코드가 포함됩니다.
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                // 3. 앱은 이 인증 코드를 사용하여 제공자에게 액세스 토큰을 요청합니다.
                const response = await trackPromise(api.post('https://oauth2.googleapis.com/token', {
                    code: code,
                    client_id: 'YOUR_CLIENT_ID',
                    client_secret: 'YOUR_CLIENT_SECRET',
                    redirect_uri: 'YOUR_REDIRECT_URI',
                    grant_type: 'authorization_code',
                }));

                // 4. 제공자는 액세스 토큰을 앱에 제공합니다.
                const accessToken = response.data.access_token;

                // 5. 앱은 이 토큰을 사용하여 사용자의 정보를 요청하고, 이 정보를 사용하여 사용자를 인증합니다.
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return <button onClick={handleLogin}>Login with Google</button>;
}

export default GgLoginButton;