import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { api } from "./api";

// Custom confirmation modal component
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Just a moment!</h2>
        <p className="mb-4 text-gray-600">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <p className="mb-6 text-sm text-gray-500">
          정말 우리와 헤어지고 싶으신가요? 계정을 삭제하면 모든 추억이 사라져요. 😢
        </p>
        <p className="mb-6 text-sm text-gray-500">
          혹시 잠깐 쉬어가고 싶은 건 아닌가요? 나중에 다시 돌아오고 싶어질 수도 있어요. 어떠세요?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
            onClick={onClose}
          >
            No, Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function DeleteAccountButton() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      const response = await trackPromise(
        api.delete("/api/v1/user", {
          withCredentials: true,
        })
      );
      if (response.status === 200) {
        toast.success("Account deleted successfully");
        navigate("/", { replace: true });
      } else {
        toast.error("An error occurred");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <>
      <button
        className="text-gray-500 hover:text-gray-700 text-sm font-normal underline"
        onClick={() => setIsModalOpen(true)}
        aria-label="Delete Account"
      >
        Delete Account
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

export default DeleteAccountButton;