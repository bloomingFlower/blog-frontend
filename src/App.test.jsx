import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// 필요한 모듈들을 모킹합니다.
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
}));

test('renders without crashing', () => {
  render(<App />);
  // App 컴포넌트가 에러 없이 렌더링되는지 확인합니다.
  expect(screen.getByTestId('app-component')).toBeInTheDocument();
});