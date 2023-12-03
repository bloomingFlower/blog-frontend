import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@img/background2.png";
import PasswordInput from "./components/PasswordInput";

const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 패스워드 복잡도 검사
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must contain minimum eight characters, at least one letter and one number");
            return;
        }

        // 패스워드 확인 검사
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // 회원가입 로직 구현
        // ...

        // 회원가입 성공 후 홈페이지로 이동
        navigate("/");
    };

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
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={90} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Password:</span>
                        <PasswordInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={50} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
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