// api.js
import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const getBaseURL = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.REACT_APP_API_URL;
  }
  return window.ENV.REACT_APP_API_URL !== "%REACT_APP_API_URL%"
    ? window.ENV.REACT_APP_API_URL
    : "";
};

const getBaseURL2 = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.REACT_APP_API_URL2;
  }
  return window.ENV.REACT_APP_API_URL2 !== "%REACT_APP_API_URL2%"
    ? window.ENV.REACT_APP_API_URL2
    : "";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // 자격 증명을 포함하는 옵션
});

// api.interceptors.request.use(async (config) => {
//   const token = sessionStorage.getItem("jwt");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   config.metadata = { startTime: new Date() }; // 요청 시작 시간 기록
//   config.cancelToken = new axios.CancelToken(
//     (cancel) => (config.canceller = cancel)
//   );
//   return config;
// });

// api.interceptors.response.use(
//   async (response) => {
//     const { config, status } = response;
//     const endTime = new Date(); // 요청 종료 시간 기록
//     const responseTime = endTime - config.metadata.startTime; // 응답 시간 계산

//     // 로그 데이터 생성
//     const logData = {
//       method: config.method.toUpperCase(),
//       url: config.url,
//       ip: "", // IP 주소는 클라이언트 측에서 알 수 없으므로 빈 문자열로 설정
//       statusCode: status,
//       responseTime,
//     };

//     // 로그 데이터를 서버에 보냄
//     try {
//       await axios.post(`${getBaseURL()}/api/v1/log`, logData, {
//         withCredentials: true,
//       });
//     } catch (error) {
//       console.error("Failed to send log data:", error);
//     }

//     await trackPromise(Promise.resolve(response));
//     return response;
//   },
//   async (error) => {
//     // 에러 처리
//     await trackPromise(Promise.reject(error));
//     return Promise.reject(error);
//   }
// );

// 두 번째 API 인스턴스 생성
const api2 = axios.create({
  baseURL: getBaseURL2(),
  withCredentials: true, // 자격 증명을 포함하는 옵션
});

// api2에 대한 인터셉터 설정 (필요한 경우)
// api2.interceptors.request.use(async (config) => {
//   const token = sessionStorage.getItem("jwt");
//   if (token) {
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   config.metadata = { startTime: new Date() }; // 요청 시작 시간 기록
//   config.cancelToken = new axios.CancelToken(
//     (cancel) => (config.canceller = cancel)
//   );
//   return config;
// });

// api2.interceptors.response.use(
//   async (response) => {
//     // api2에 대한 응답 처리 로직
//     return response;
//   },
//   async (error) => {
//     // api2에 대한 에러 처리 로직
//     return Promise.reject(error);
//   }
// );

export { api, api2 };
