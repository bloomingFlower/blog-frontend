import '@testing-library/jest-dom';

// CSS 모듈 모킹
jest.mock('react-toastify/dist/ReactToastify.css', () => ({}));

// JSDOM 환경 설정
global.jsdom = {
  url: "http://127.0.0.1/"
};