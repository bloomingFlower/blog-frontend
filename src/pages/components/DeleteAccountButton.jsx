import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate  } from "react-router-dom";
import {trackPromise} from "react-promise-tracker";
import api from "./api";

function DeleteAccountButton() {
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                const response = await trackPromise(api.delete("/api/user", {
                    withCredentials: true
                }));
                if (response.status === 200) {
                    toast.success("User deleted successfully");
                } else {
                    toast.error("An error occurred");
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred");
                }
            }
        }
        navigate("/Logout");
    };

    return (
        <div className="flex items-center">
            <button className="text-gray-400 text-sm hover:text-indigo-500" onClick={handleDeleteAccount}>회원탈퇴</button>
        </div>
    );
}

export default DeleteAccountButton;