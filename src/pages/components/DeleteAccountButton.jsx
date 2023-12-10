import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate  } from "react-router-dom";
import API_SERVER_URL from '../../apiConfig';

function DeleteAccountButton() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    const jwt = sessionStorage.getItem('jwt');
    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            setLoading(true); // axios 호출 시작 전에 로딩 상태를 true로 설정
            try {
                const response = await axios.delete(`${API_SERVER_URL}/api/user`, {
                    withCredentials: true
                });
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
            } finally {
                setLoading(false); // axios 호출 완료 후에 로딩 상태를 false로 설정
            }
        }
        navigate("/Logout");
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p> // 로딩 중일 때 로딩 표시 렌더링
            ) : (
                <button className="text-indigo-600 hover:text-indigo-500" onClick={handleDeleteAccount}>회원탈퇴 </button>
            )}
        </div>
    );}

export default DeleteAccountButton;