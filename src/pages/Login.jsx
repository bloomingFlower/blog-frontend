import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import backgroundImage from "@img/background2.webp";
import { AuthContext } from "./components/AuthContext";
import DeleteAccountButton from "./components/DeleteAccountButton";
import { trackPromise } from "react-promise-tracker";
import { api } from "./components/api";
import { FaUser, FaLock, FaGithub, FaEnvelope } from "react-icons/fa";
import { usePromiseTracker } from "react-promise-tracker";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUsername, setStoredUsername] = useState(""); // Generate a state to store the username of the logged-in user
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // get setIsLoggedIn function
  const [inputCompleted, setInputCompleted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isInputActive, setIsInputActive] = useState(false);
  const shouldNavigate = useRef(false);
  const { promiseInProgress } = usePromiseTracker();
  const [showCountdown, setShowCountdown] = useState(true);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  const resetCountdown = useCallback(() => {
    setCountdown(10);
    setIsInputActive(false);
  }, []);

  useEffect(() => {
    resetCountdown();
  }, [resetCountdown]);

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
    let timer;
    if (!isLoggedIn && !isInputActive && isCountdownActive) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === 1) {
            clearInterval(timer);
            shouldNavigate.current = true;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isLoggedIn, isInputActive, isCountdownActive]);

  useEffect(() => {
    if (shouldNavigate.current) {
      navigate("/");
    }
  }, [countdown, navigate]);

  useEffect(() => {
    // Check if there's a remembered login
    const rememberedLogin = localStorage.getItem("rememberedLogin");
    if (rememberedLogin) {
      const { username, password } = JSON.parse(rememberedLogin);
      setUsername(username);
      setPassword(password);
      setRememberMe(true);
    }
  }, []);

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
          "/api/v1/login",
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
          // Save login info to localStorage if "Remember me" is checked
          localStorage.setItem(
            "rememberedLogin",
            JSON.stringify({ username, password })
          );
        } else {
          // Clear remembered login if not checked
          localStorage.removeItem("rememberedLogin");
        }

        setUsername(data.user.first_name); // username 상태 설정
        setIsLoggedIn(true); // set isLoggedIn state to true
        sessionStorage.setItem("isLoggedIn", true); // 세션 스토리지에 isLoggedIn 상태 저장

        navigate(-1);
      } else {
        toast.error("Failed to log in: " + response.status);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("User not found", {
            toastId: "userNotFound",
          });
        } else if (error.response.status === 401) {
          toast.error("Incorrect password", {
            toastId: "incorrectPassword",
          });
        } else {
          toast.error(
            `An error occurred: ${
              error.response.data.message || "Unknown error"
            }`,
            {
              toastId: "generalError",
            }
          );
        }
      } else {
        toast.error("Network error", {
          toastId: "networkError",
        });
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
    setBackgroundColor("yellow");
  };

  const handleInputChange = useCallback((e) => {
    setIsInputActive(true);
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  }, []);

  const handleInputBlur = useCallback(() => {
    if (username === "" && password === "") {
      setIsInputActive(false);
    }
  }, [username, password]);

  // GitHub login handler
  const handleGitHubLogin = async () => {
    setShowCountdown(false);
    setIsCountdownActive(false);
    try {
      const response = await api.get("/api/v1/auth/github/login");
      if (response.data && response.data.url) {
        // Redirect to GitHub login page in the current window
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to receive GitHub authentication URL.");
      }
    } catch (error) {
      console.error("GitHub login error:", error);
      toast.error(`GitHub login error: ${error.message}`);
    }
  };

  // GitHub callback handling
  useEffect(() => {
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");

      if (error) {
        console.error("GitHub login error:", error, errorDescription);
        toast.error(`GitHub login error: ${errorDescription || error}`);
        setShowCountdown(true);
        setIsCountdownActive(true);
        return;
      }

      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        try {
          const response = await api.get(
            `/api/v1/auth/github/callback?code=${code}&state=${state}`
          );
          const { token, user } = response.data;

          if (token && user) {
            // Save information to session storage
            sessionStorage.setItem("jwt", token);
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("username", user.first_name || user.login);
            sessionStorage.setItem("isLoggedIn", "true");

            setUsername(user.first_name || user.login);
            setIsLoggedIn(true);

            toast.success("GitHub login successful!");
            navigate("/"); // Redirect to the main page
          } else {
            toast.error("Failed to receive GitHub login information.");
          }
        } catch (error) {
          console.error("Error handling GitHub callback:", error);
          toast.error("An error occurred while handling the GitHub callback.");
        }
      }
    };

    handleGitHubCallback();
  }, [location.search]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
              {!isInputActive && showCountdown && (
                <p className="mt-2 text-center text-sm text-gray-600">
                  Auto-redirecting to home page in {countdown} seconds.
                </p>
              )}
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
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onFocus={handleFocus}
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
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
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

                  {/* <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-indigo-6000 hover:text-indigo-500"
                      aria-label="Forgot your password?"
                    >
                      Forgot your password?
                    </a>
                  </div> */}
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={promiseInProgress}
                  >
                    {promiseInProgress ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-100 text-gray-500">
                      Sign up with
                    </span>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <button
                    onClick={() => (window.location.href = "/signup")}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaEnvelope className="w-5 h-5 mr-2" />
                    Sign up with Email
                  </button>
                  <button
                    onClick={handleGitHubLogin}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <FaGithub className="w-5 h-5 mr-2" />
                    Continue with GitHub
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
