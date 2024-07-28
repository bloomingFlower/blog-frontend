import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.webp";
import PasswordInput from "./components/PasswordInput";
import { trackPromise } from "react-promise-tracker";
import api from "./components/api";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  getExampleNumber,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/examples.mobile.json";
import { usePromiseTracker } from "react-promise-tracker";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(""); // phone 상태 추가
  const [countryCode, setCountryCode] = useState("KR"); // 국가 코드 상태 추가
  const [emailExists, setEmailExists] = useState(false); // 이메일 존재 상태 추가
  const emailRef = useRef(); // 이메일 입력 필드 참조 생성

  const navigate = useNavigate();

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
  };

  // 전화번호 입력 처리 함수 추가
  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    try {
      const phoneNumber = parsePhoneNumber(input, countryCode);
      if (phoneNumber) {
        setPhone(phoneNumber.formatNational());
      } else {
        setPhone(input);
      }
    } catch (error) {
      setPhone(input);
    }
  };

  const phoneNumberHint = useMemo(() => {
    const exampleNumber = getExampleNumber(countryCode, examples);
    return exampleNumber ? exampleNumber.formatNational() : "";
  }, [countryCode]);

  const { promiseInProgress } = usePromiseTracker();

  const handleSubmit = async (e) => {
    // Add async keyword here
    e.preventDefault();

    // 패스워드 복잡도 검사
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain minimum eight characters, at least one letter, one number, and one special character"
      );
      return;
    }

    // 패스워드 확인 검사
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isValidPhoneNumber(phone, countryCode)) {
      toast.error(
        "Invalid phone number. Please enter a valid phone number for the selected country."
      );
      return;
    }

    // 회원가입 로직 구현
    try {
      const response = await trackPromise(
        api.post("/api/v1/register", {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          phone: phone,
        })
      );

      if (response.status === 201) {
        // 회원가입 성공 후 홈페이지로 이동
        navigate("/");
      } else {
        // 에러 메시지 표시
        alert(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message === "Email already exists"
      ) {
        setEmailExists(true); // 이메일이 이미 존재하면 상태를 true로 설정
      } else {
        console.error("Signup failed:", error);
      }
    }
  };
  // 이메일이 이미 존재하면 이메일 입력 필드에 포커스
  useEffect(() => {
    if (emailExists) {
      emailRef.current.focus();
      toast.error("Email already exists");
    }
  }, [emailExists]);
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400 z-10" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={20}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                placeholder="First Name"
                required
                aria-label="First Name"
              />
            </div>
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400 z-10" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={20}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                placeholder="Last Name"
                required
                aria-label="Last Name"
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400 z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={90}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  emailExists ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10`}
                placeholder="Email address"
                ref={emailRef}
                required
                aria-label="Email address"
              />
            </div>
            <div className="relative flex flex-col">
              <div className="flex items-center">
                <FaPhone className="absolute left-3 text-gray-400 z-10" />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="appearance-none rounded-l-md relative block w-2/5 pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  aria-label="Country code"
                >
                  <option value="US">+1 (US)</option>
                  <option value="RU">+7 (RU)</option>
                  <option value="FR">+33 (FR)</option>
                  <option value="GB">+44 (GB)</option>
                  <option value="DE">+49 (DE)</option>
                  <option value="AU">+61 (AU)</option>
                  <option value="JP">+81 (JP)</option>
                  <option value="KR">+82 (KR)</option>
                  <option value="CN">+86 (CN)</option>
                  <option value="IN">+91 (IN)</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  className="appearance-none rounded-r-md relative block w-3/5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone number"
                  required
                  aria-label="Phone number"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Example: {phoneNumberHint}
              </p>
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400 z-10" />
              <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                maxLength={50}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                placeholder="Password"
                aria-label="Password"
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400 z-10" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={50}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  password !== confirmPassword && password && confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10`}
                placeholder="Confirm Password"
                required
                aria-label="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              aria-label="Sign Up"
              disabled={promiseInProgress}
            >
              {promiseInProgress ? (
                <span className="flex items-center">
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
                  Processing...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <a
            href="/admin-login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
