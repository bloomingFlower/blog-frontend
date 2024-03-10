import React, { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Post from "./pages/Post";
import PostUpload from "./pages/PostUpload";
import Scrap from "./pages/Scrap";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Logout from './pages/components/Logout';
import Signup from './pages/Signup';
import EditProfile from "./pages/EditProfile";
import Footer from "./pages/components/Footer";
import LoadingIndicator from './pages/components/LoadingIndicator';

import HamburgerButton from "./pages/components/HamburgerButton";
import { AuthContext, AuthProvider } from './pages/components/AuthContext';
// import { GoogleOAuth } from '@react-oauth/google';

import "tailwindcss/tailwind.css";
import "./styles/loading.css";
import SystemStack from "./pages/SystemStack";

function App() {
  const [data, setData] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창 상태 추가
  const searchRef = useRef(); // 검색창 참조 생성
  const responseGoogle = (response) => {
    console.log(response);
  }
  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    axios
        .get(`${process.env.REACT_APP_API_URL}/api/data`) // Go Fiber 백엔드의 API 엔드포인트
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
  }, []);
  return (
      <AuthProvider>
        <Router>
          <div>
            <nav
                className="flex items-center justify-between p-3"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  height: "60%",
                  fontFamily: "PlayfairDisplay, serif",
                  position: "relative",
                }}
            >
              <Link to="/" className="text-xl">
                Our Journey
              </Link>
              {/*<GoogleOAuth*/}
              {/*      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}*/}
              {/*      buttonText="Login with Google"*/}
              {/*      onSuccess={responseGoogle}*/}
              {/*      onFailure={responseGoogle}*/}
              {/*      cookiePolicy={'single_host_origin'}*/}
              {/*      />*/}
              <div className="flex items-center">
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className={`${isSearchOpen ? "animate-slide-in-right" : ""} mr-4`}
                >
                  <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-6a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
                {isSearchOpen && (
                    <div ref={searchRef} className="animate-fade-in-right">
                      <input
                          type="text"
                          placeholder="Search..."
                          style={{ backgroundColor: "#f8f8f8" }}
                          className="bg-gray-200 text-xs"
                      />
                    </div>
                )}
                <HamburgerButton style={{ width: "40px", height: "40px" }} />
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post" element={<Post />} />
              <Route path="/post/upload" element={<PostUpload />} />
              <Route path="/scrap" element={<Scrap />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/system-stack" element={<SystemStack />} />
              <Route path="*" element={<NotFound />} /> {/* 일치하는 경로가 없을 때 404 페이지 렌더링 */}
            </Routes>
            <ToastContainer />
            <Footer/>
          </div>
        </Router>
        <LoadingIndicator />
      </AuthProvider>
  );
}

export default App;