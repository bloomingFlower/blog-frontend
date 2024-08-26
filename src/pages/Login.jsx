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
import CryptoJS from 'crypto-js';
import GoogleLogo from '../static/img/google-logo.svg';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import DataHandling from './components/DataHandling';

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
          <div className="mt-2 px-7 py-3 max-h-96 overflow-y-auto">
            {content}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // AuthContext에서 user와 isLoggedIn을 가져옵니다.
  const { user, isLoggedIn, setUser, login } = useContext(AuthContext);

  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUsername, setStoredUsername] = useState("");
  const [inputCompleted, setInputCompleted] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isInputActive, setIsInputActive] = useState(false);
  const shouldNavigate = useRef(false);
  const { promiseInProgress } = usePromiseTracker();
  const [showCountdown, setShowCountdown] = useState(true);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [isTimeoutEnabled, setIsTimeoutEnabled] = useState(false);

  const encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'fallback-key';

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, encryptionKey).toString();
  };

  const decryptPassword = (encryptedPassword) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt password:', error);
      return '';
    }
  };

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
    if (!isLoggedIn && !isInputActive && isCountdownActive && isTimeoutEnabled) {
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
  }, [isLoggedIn, isInputActive, isCountdownActive, isTimeoutEnabled]);

  useEffect(() => {
    if (shouldNavigate.current) {
      navigate("/");
    }
  }, [countdown, navigate]);

  useEffect(() => {
    // Check if there's a remembered login
    const rememberedLogin = localStorage.getItem('rememberedLogin');
    if (rememberedLogin) {
      try {
        const { username, encryptedPassword } = JSON.parse(rememberedLogin);
        setUsername(username);
        const decryptedPassword = decryptPassword(encryptedPassword);
        if (decryptedPassword) {
          setPassword(decryptedPassword);
          setRememberMe(true);
        } else {
          // Delete the saved information if decryption fails
          localStorage.removeItem('rememberedLogin');
        }
      } catch (error) {
        console.error('Failed to parse remembered login:', error);
        localStorage.removeItem('rememberedLogin');
      }
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
        const data = response.data; // Save the response body to the data variable
        const jwtCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="));

        if (jwtCookie) {
          const jwt = jwtCookie.split("=")[1];
          // Use the jwt after this
        } else {
          console.error("JWT cookie is missing");
        }
        // Create a session
        const jwt = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jwt="))
          .split("=")[1];
        if (jwt === undefined) {
          toast.error("jwt is undefined");
          return;
        }
        sessionStorage.setItem("jwt", jwt); // Save JWT to session storage
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("username", data.user.first_name);

        if (rememberMe) {
          try {
            const encryptedPassword = encryptPassword(password);
            localStorage.setItem('rememberedLogin', JSON.stringify({ username, encryptedPassword }));
          } catch (error) {
            console.error('Failed to encrypt password:', error);
            // Do not save if encryption fails
          }
        } else {
          // Clear remembered login if not checked
          localStorage.removeItem("rememberedLogin");
        }

        setUsername(data.user.first_name); // Set username state
        login(data.user); // Update user state in AuthContext
        navigate("/", { replace: true });
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
            `An error occurred: ${error.response.data.message || "Unknown error"
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

  // Unified OAuth login handler
  const handleOAuthLogin = async (provider) => {
    setShowCountdown(false);
    setIsCountdownActive(false);
    try {
      const response = await api.get(`/api/v1/auth/${provider}/login`);
      if (response.data && response.data.url) {
        // Redirect to OAuth login page in the current window
        window.location.href = response.data.url;
      } else {
        toast.error(`Failed to receive ${provider} authentication URL.`);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`${provider} login error: ${error.message}`);
    }
  };

  // OAuth callback handling
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");

      if (error) {
        console.error("OAuth login error:", error, errorDescription);
        toast.error(`OAuth login error: ${errorDescription || error}`);
        setShowCountdown(true);
        setIsCountdownActive(true);
        return;
      }

      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        try {
          const response = await api.get(
            `/api/v1/auth/oauth/callback?code=${code}&state=${state}`
          );
          const { token, user } = response.data;

          if (token && user) {
            // Save information to session storage
            sessionStorage.setItem("jwt", token);
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("username", user.first_name || user.login);
            sessionStorage.setItem("isLoggedIn", "true");

            setUsername(user.first_name || user.login);
            setUser(user);

            toast.success("OAuth login successful!");
            navigate("/"); // Redirect to the main page
          } else {
            toast.error("Failed to receive OAuth login information.");
          }
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
          toast.error("An error occurred while handling the OAuth callback.");
        }
      }
    };

    handleOAuthCallback();
  }, [location.search]);

  // Modal related state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: null });

  // Open modal function
  const openModal = (title, ContentComponent) => {
    setModalContent({ title, content: <ContentComponent /> });
    setModalOpen(true);
  };

  // 사용자 이니셜을 생성하는 함수
  const getUserInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between bg-cover py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-6 sm:p-10 rounded-xl shadow-2xl">
          <div>
            {isLoggedIn && user ? (
              <>
                <h1 className="text-2xl font-bold mb-4">
                  What can we help you? {user.first_name || storedUsername}
                </h1>
                <div className="flex items-center space-x-4">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => navigate('/edit-profile')}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center bg-indigo-600 text-white text-sm font-bold"
                      onClick={() => navigate('/edit-profile')}
                    >
                      {getUserInitials(user.first_name || storedUsername)}
                    </div>
                  )}
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
                {isTimeoutEnabled && !isInputActive && showCountdown && (
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
                        className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${isEmailInvalid ? "border-red-500" : "border-gray-300"
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
                      onClick={() => handleOAuthLogin('github')}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 relative"
                    >
                      <FaGithub className="w-5 h-5 mr-2" />
                      Continue with GitHub
                      <span className="ml-2 text-xs text-gray-300 hover:text-gray-100 cursor-help" title="We access your GitHub profile information. Click for more info.">ⓘ</span>
                    </button>
                    <button
                      onClick={() => handleOAuthLogin('google')}
                      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 relative"
                    >
                      <img src={GoogleLogo} alt="Google logo" className="w-5 h-5 mr-2" />
                      Continue with Google
                      <span className="ml-2 text-xs text-gray-500 hover:text-gray-700 cursor-help" title="We access your name and email from Google. Click for more info.">ⓘ</span>
                      <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-1 bg-yellow-400 text-xs font-bold rounded-full">Testing...</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-center text-xs text-gray-600">
                  <p>
                    By signing in, you agree to our{' '}
                    <a href="/terms-of-service" className="text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy-policy" className="text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                    .
                  </p>
                  <p className="mt-2">
                    Learn more about how we handle your data for{' '}
                    <a href="/data-handling" className="text-indigo-600 hover:text-indigo-500">
                      each login method
                    </a>
                    .
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </div>
  );
};

export default Login;
