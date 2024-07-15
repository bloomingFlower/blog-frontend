import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.webp";
import { trackPromise } from "react-promise-tracker";
import api from "./components/api";

const EditProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [initialUser, setInitialUser] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        setInitialUser(user); // 초기 상태 저장
        setUser(user);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);
        setPhone(user.phone);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser().catch((error) => console.error(error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // user 객체 업데이트
    const updatedUser = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    };

    if (isEqual(updatedUser, initialUser)) {
      alert("No changes were made");
      return;
    }

    // 전화번호 패턴 검사
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(updatedUser.phone)) {
      toast.error("Invalid phone number. Please enter 10 digit phone number.");
      return;
    }

    const jwt = sessionStorage.getItem("jwt");
    try {
      const response = await trackPromise(
        api.put(
          "/api/user",
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        )
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        sessionStorage.setItem("username", updatedUser.first_name);
        setUsername(updatedUser.first_name); // username 상태 설정
        navigate("/");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-50 p-6 rounded-lg">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">First Name:</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              maxLength={20}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Last Name:</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              maxLength={20}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={90}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              disabled
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Phone:</span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
