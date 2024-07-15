import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.webp";
import PasswordInput from "./components/PasswordInput";
import { trackPromise } from "react-promise-tracker";
import api from "./components/api";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState(""); // phone 상태 추가
  const [countryCode, setCountryCode] = useState("+1"); // 국가 코드 상태 추가
  const [emailExists, setEmailExists] = useState(false); // 이메일 존재 상태 추가
  const emailRef = useRef(); // 이메일 입력 필드 참조 생성

  const navigate = useNavigate();

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
  };

  // 전화번호 입력 처리 함수 추가
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    let phoneNumber = "";
    if (value.length <= 3) {
      phoneNumber = value;
    } else if (value.length <= 7) {
      phoneNumber = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else {
      phoneNumber = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(
        7,
        11
      )}`;
    }
    setPhone(phoneNumber);
  };

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

    // 전화번호 패턴 검사
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Invalid phone number. Please enter 10 digit phone number.");
      return;
    }

    // 회원가입 로직 구현
    try {
      const response = await trackPromise(
        api.post("/api/register", {
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
              />
            </div>
            <div className="relative flex items-center">
              <FaPhone className="absolute left-3 text-gray-400 z-10" />
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="appearance-none rounded-none relative block w-1/3 pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="+1">+1</option>
                <option value="+82">+82</option>
                <option value="+88">+88</option>
              </select>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={13}
                className="appearance-none rounded-none relative block w-2/3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone number"
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400 z-10" />
              <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                maxLength={50}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pl-10"
                placeholder="Password"
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
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Sign Up
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
