// api.js
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import API_SERVER_URL from '../../apiConfig';

const api = axios.create({
    baseURL: API_SERVER_URL, // API 서버의 기본 URL
});

api.interceptors.request.use(async (config) => {
    config.cancelToken = new axios.CancelToken(cancel => config.canceller = cancel);
    // 요청 정보를 로그로 저장
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    if (config.params) {
        console.log(`Params: ${JSON.stringify(config.params)}`);
    }
    if (config.data) {
        console.log(`Data: ${JSON.stringify(config.data)}`);
    }
    // 요청 정보를 로그로 저장
    const logData = {
        method: config.method.toUpperCase(),
        url: config.url,
        params: config.params ? JSON.stringify(config.params) : null,
        data: config.data ? JSON.stringify(config.data) : null,
    };
    // 로그 데이터를 서버에 보냄
    try {
        await axios.post(`${API_SERVER_URL}/api/logs`, logData);
    } catch (error) {
        console.error('Failed to send log data:', error);
    }
    // 요청 헤더에 인증 토큰 추가
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
});

api.interceptors.response.use(
    async (response) => {
        await trackPromise(Promise.resolve(response));
        // 응답 데이터 처리
        // const data = response.data;
        // return data;
        return response;
    },
    async (error) => {
        // 에러 처리
        // console.error('An error occurred:', error);
        await trackPromise(Promise.reject(error));
        return Promise.reject(error);
    }
);

export default api;