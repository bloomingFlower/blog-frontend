import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.png";
import { AuthContext } from './components/AuthContext';
import DeleteAccountButton from "./components/DeleteAccountButton";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [storedUsername, setStoredUsername] = useState(""); // 로그인한 사용자의 아이디를 저장할 상태 생성
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // get setIsLoggedIn function
  const [inputCompleted, setInputCompleted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setStoredUsername(storedUsername); // 세션 스토리지에서 가져온 username 값을 storedUsername 상태에 설정
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [navigate, isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(username)) {
      setIsEmailInvalid(true);
      toast.error("Invalid email format");
      return;
    }
    try {
      const response = await fetch("http://localhost:8008/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
        credentials: 'include', // 쿠키를 요청에 포함

      });

      if (response.ok) {
        const data = await response.json(); // 응답 본문을 JSON으로 파싱
        // 세션 생성
        const jwt = data.jwt;
        sessionStorage.setItem('jwt', jwt); // JWT를 세션 스토리지에 저장
        sessionStorage.setItem("email", data.user.email);
        sessionStorage.setItem("username", data.user.first_name);
        setUsername(data.user.first_name); // username 상태 설정
        setIsLoggedIn(true); // set isLoggedIn state to true
        sessionStorage.setItem('isLoggedIn', true); // 세션 스토리지에 isLoggedIn 상태 저장


        // 토스트 메시지 출력
        //toast.success("Welcome" + {storedUsername});
        navigate(-1);
      } else {
        toast.error("Failed to log in: " + response.status);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  const handleLogout = () => {
    navigate("/Logout");
  };

  const handleFocus = () => {
    setIsEmailInvalid(false);
  };

  const handleBlur = (e) => {
    setInputCompleted(true);
    setBackgroundColor("yellow"); // 원하는 색상으로 변경
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-50 p-6 rounded-lg">
        <div>
          {isLoggedIn ? (
          <>
            <h1>무엇을 도와드릴까요? {storedUsername}님?</h1>
            <div className="flex justify-center space-x-4">
              <a href="/edit-profile" className="text-indigo-600 hover:text-indigo-500">회원정보 수정</a>
              <button onClick={handleLogout} className="text-indigo-600 hover:text-indigo-500">로그아웃</button>
              <DeleteAccountButton/>

            </div>
          </>

        ) : (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <input type="hidden" name="remember" value="true" />
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${isEmailInvalid ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white bg-opacity-50`}
                    placeholder="Username"
                    value={username} // username 상태와 입력 필드 연결
                    onChange={(e) => setUsername(e.target.value)} // 입력이 변경될 때마다 username 상태 업데이트
                    style={{ backgroundColor: inputCompleted ? backgroundColor : "white" }}
                />
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required

                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white bg-opacity-50"
                  placeholder="Password"
                  value={password} // password 상태와 입력 필드 연결
                  onChange={(e) => setPassword(e.target.value)} // 입력이 변경될 때마다 password 상태 업데이트
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href="/"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
              <div>
                <button
                    type="button"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => navigate("/signup")}
                >
                  회원 가입
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
