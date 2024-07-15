import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.webp";
import { AuthContext } from "./components/AuthContext";
import DeleteAccountButton from "./components/DeleteAccountButton";
import { trackPromise } from "react-promise-tracker";
import api from "./components/api";
import { FaUser, FaLock } from "react-icons/fa";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUsername, setStoredUsername] = useState(""); // 로그인한 사용자의 아이디를 저장할 상태 생성
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // get setIsLoggedIn function
  const [inputCompleted, setInputCompleted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
      const response = await trackPromise(
        api.post(
          "/api/login",
          {
            email: username,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
      );
      if (response.status === 200) {
        const data = response.data; // 응답 본문을 data 변수에 저장
        const jwtCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="));

        if (jwtCookie) {
          const jwt = jwtCookie.split("=")[1];
          // 이후 jwt를 사용하는 코드
        } else {
          console.error("JWT cookie is missing");
        }
        // 세션 생성
        const jwt = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="))
          .split("=")[1];
        if (jwt === undefined) {
          toast.error("jwt is undefined");
          return;
        }
        sessionStorage.setItem("jwt", jwt); // JWT를 세션 스토리지에 저장
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("username", data.user.first_name);

        if (rememberMe) {
          // 로컬 스토리지에 로그인 정보 저장
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", data.user.first_name);
        } else {
          // 세션 스토리지에 로그인 정보 저장
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("username", data.user.first_name);
        }

        setUsername(data.user.first_name); // username 상태 설정
        setIsLoggedIn(true); // set isLoggedIn state to true
        sessionStorage.setItem("isLoggedIn", true); // 세션 스토리지에 isLoggedIn 상태 저장

        navigate(-1);
      } else {
        toast.error("Failed to log in: " + response.status);
      }
    } catch (error) {
      if (error.status === 404) {
        toast.error("User not found");
      } else if (error.status === 401) {
        toast.error("Incorrect password");
      } else {
        toast.error("An error occurred");
      }
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
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-6 sm:p-10 rounded-xl shadow-2xl">
        <div>
          {isLoggedIn ? (
            <>
              <h1 className="text-2xl font-bold mb-4">
                What can we help you? {storedUsername}
              </h1>
              <div className="flex items-center space-x-4">
                <a
                  href="/edit-profile"
                  className="text-indigo-600 text-sm hover:text-indigo-500"
                >
                  Edit your profile
                </a>
                <button
                  onClick={handleLogout}
                  className="text-indigo-600 text-sm hover:text-indigo-500"
                  aria-label="Logout"
                >
                  Logout
                </button>
                <DeleteAccountButton />
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
                Sign in
              </h2>
              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                  <div className="relative">
                    <label htmlFor="username" className="sr-only">
                      Email address
                    </label>
                    <FaUser className="absolute top-3 left-3 text-gray-400 z-10" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        isEmailInvalid ? "border-red-500" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base pl-10`}
                      placeholder="Email address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      style={{
                        backgroundColor: inputCompleted
                          ? backgroundColor
                          : "white",
                      }}
                      aria-label="Email address"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <FaLock className="absolute top-3 left-3 text-gray-400 z-10" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm sm:text-base pl-10"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-label="Password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      aria-label="Remember me"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-6000 hover:text-indigo-500"
                      aria-label="Forgot your password?"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <div className="text-sm text-center">
                <a
                  href="/signup"
                  className="font-medium text-indigo-6000 hover:text-indigo-500"
                  aria-label="Don't have an account? Sign up"
                >
                  Don't have an account? Sign up
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
