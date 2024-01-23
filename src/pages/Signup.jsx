import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.png";
import PasswordInput from "./components/PasswordInput";
import {trackPromise} from "react-promise-tracker";
import api from "./components/api";

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

    const handleSubmit = async (e) => { // Add async keyword here
        e.preventDefault();

        // 패스워드 복잡도 검사
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(password)) {
            toast.error("Password must contain minimum eight characters, at least one letter, one number, and one special character");
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
            const response = await trackPromise(api.post("/api/register", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                phone: phone
            }));

            if (response.status === 201) {
                // 회원가입 성공 후 홈페이지로 이동
                navigate("/");
            } else {
                // 에러 메시지 표시
                alert(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data.message === "Email already exists") {
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
        <div className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="max-w-md w-full space-y-8 bg-white bg-opacity-50 p-6 rounded-lg">
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <label className="block">
                        <span className="text-gray-700">First Name:</span>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={20} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Last Name:</span>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={20} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Email:</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={90}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${emailExists ? 'border-red-500' : ''}`}
                            ref={emailRef} // 이메일 입력 필드 참조 설정
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Phone:</span>
                        <div className="flex space-x-2">
                            <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                <option value="+1">+1</option>
                                <option value="+82">+82</option>
                                <option value="+88">+88</option>
                                {/* 필요한 국가 코드를 추가하세요 */}
                            </select>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                        </div>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Password:</span>
                        <PasswordInput type="password" value={password} onChange={handlePasswordChange} maxLength={50} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Confirm Password:</span>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            maxLength={50}
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${password !== confirmPassword && password && confirmPassword ? 'border-red-500' : ''}`}
                        />
                    </label>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;