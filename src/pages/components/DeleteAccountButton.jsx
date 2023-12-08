import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

function DeleteAccountButton() {
    const jwt = sessionStorage.getItem('jwt'); // 세션 스토리지에서 JWT 가져오기

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            try {
                const response = await axios.delete("http://localhost:8008/api/users/delete", {
                    headers: {
                        'Authorization': `Bearer ${jwt}` // JWT를 헤더에 포함
                    }
                });
                if (response.status === 200) {
                    toast.success("User deleted successfully");
                } else {
                    toast.error("An error occurred");
                }
            } catch (error) {
                if (error.response && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("An error occurred");
                }
            }
        }
    };

    return <button className="text-indigo-600 hover:text-indigo-500" onClick={handleDeleteAccount}>회원탈퇴 </button>;
}

export default DeleteAccountButton;