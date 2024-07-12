// api.js
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`, // API 서버의 기본 URL
    withCredentials: true, // 자격 증명을 포함하는 옵션
});

api.interceptors.request.use(async (config) => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.metadata = { startTime: new Date() }; // 요청 시작 시간 기록
    config.cancelToken = new axios.CancelToken(cancel => config.canceller = cancel);
    return config;
});

api.interceptors.response.use(
    async (response) => {
        const { config, status } = response;
        const endTime = new Date(); // 요청 종료 시간 기록
        const responseTime = endTime - config.metadata.startTime; // 응답 시간 계산

        // 로그 데이터 생성
        const logData = {
            method: config.method.toUpperCase(),
            url: config.url,
            ip: '', // IP 주소는 클라이언트 측에서 알 수 없으므로 빈 문자열로 설정
            statusCode: status,
            responseTime,
        };

        // 로그 데이터를 서버에 보냄
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/log`, logData, { withCredentials: true });
        } catch (error) {
            console.error('Failed to send log data:', error);
        }

        await trackPromise(Promise.resolve(response));
        return response;
    },
    async (error) => {
        // 에러 처리
        await trackPromise(Promise.reject(error));
        return Promise.reject(error);
    }
);

export default api;