import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import backgroundImage from "@img/background2.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8008/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json(); // 응답 본문을 JSON으로 파싱

      // 세션 생성
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("username", data.username);

      // 토스트 메시지 출력
      toast.success("Welcome Master");
      setTimeout(() => {
        navigate("/next-page");
      }, 2000);
    } else {
      toast.error("Failed to log in");
    }
  };

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg">
      <div>
        {storedUsername ? (
          <h1>무엇을 도와드릴까요, {storedUsername}님?</h1>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username} // username 상태와 입력 필드 연결
                onChange={(e) => setUsername(e.target.value)} // 입력이 변경될 때마다 username 상태 업데이트
              />
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
         </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
