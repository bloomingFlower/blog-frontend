import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "@img/background2.webp";
import { trackPromise } from "react-promise-tracker";
import { api } from "./components/api";
import { FaPhone } from "react-icons/fa";
import { parsePhoneNumber, isValidPhoneNumber, getExampleNumber } from "libphonenumber-js/max";
import examples from "libphonenumber-js/examples.mobile.json";
import DeleteAccountButton from "./components/DeleteAccountButton";

const EditProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [initialUser, setInitialUser] = useState(null);
  const [username, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("KR");
  const [showModal, setShowModal] = useState(false);
  const [showNoChangesModal, setShowNoChangesModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [updatedUser, setUpdatedUser] = useState(null);

  const countryCodes = [
    { code: "US", country: "US", dialCode: "+1" },
    { code: "RU", country: "RU", dialCode: "+7" },
    { code: "FR", country: "FR", dialCode: "+33" },
    { code: "GB", country: "GB", dialCode: "+44" },
    { code: "DE", country: "DE", dialCode: "+49" },
    { code: "AU", country: "AU", dialCode: "+61" },
    { code: "JP", country: "JP", dialCode: "+81" },
    { code: "KR", country: "KR", dialCode: "+82" },
    { code: "CN", country: "CN", dialCode: "+86" },
    { code: "IN", country: "IN", dialCode: "+91" },
  ];

  const phoneNumberHint = useMemo(() => {
    const exampleNumber = getExampleNumber(countryCode, examples);
    return exampleNumber ? exampleNumber.formatNational() : "";
  }, [countryCode]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        setInitialUser(user); // Save the initial state
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

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    try {
      const phoneNumber = parsePhoneNumber(input, countryCode);
      if (phoneNumber) {
        setPhone(phoneNumber.formatNational());
      } else {
        setPhone(input);
      }
    } catch (error) {
      setPhone(input);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update the user object
    const newUpdatedUser = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    };

    setUpdatedUser(newUpdatedUser);

    if (isEqual(newUpdatedUser, initialUser)) {
      setModalContent({
        title: "Notification",
        message: "No changes have been made.",
      });
      setShowNoChangesModal(true);
      return;
    }

    // Check if the phone number is valid for the selected country
    if (!isValidPhoneNumber(newUpdatedUser.phone, countryCode)) {
      toast.error(
        "Invalid phone number. Please enter a valid phone number for the selected country."
      );
      return;
    }

    // Display modal if all validation checks pass
    setModalContent({
      title: "Profile Update Confirmation",
      message: "Are you sure you want to update your profile with the new information?",
    });
    setShowModal(true);
  };

  const submitProfileUpdate = async () => {
    setShowModal(false);
    const jwt = sessionStorage.getItem("jwt");
    try {
      const response = await trackPromise(
        api.put(
          "/api/v1/user",
          {
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            phone: updatedUser.phone,
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
        toast.success("Profile updated successfully.");
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        sessionStorage.setItem("username", updatedUser.first_name);
        setUsername(updatedUser.first_name);
        navigate("/");
      } else {
        toast.error("Profile update failed.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("An error occurred while updating your profile.");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowNoChangesModal(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-80 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Edit Your Profile
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="first-name" className="sr-only">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={20}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="sr-only">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={20}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={90}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled
              />
            </div>
            <div className="relative flex flex-col">
              <div className="flex items-center">
                <FaPhone className="absolute left-3 text-gray-400 z-10" />
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="appearance-none rounded-l-md relative block w-2/5 pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  aria-label="Country code"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.dialCode} ({country.country})
                    </option>
                  ))}
                </select>
                <input
                  id="phone-number"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  className="appearance-none rounded-r-md relative block w-3/5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone number"
                  required
                  aria-label="Phone number"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Example: {phoneNumberHint}
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              Update Profile
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <DeleteAccountButton />
        </div>
      </div>

      {(showModal || showNoChangesModal) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {modalContent.title}
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {modalContent.message}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                {showModal ? (
                  <>
                    <button
                      onClick={submitProfileUpdate}
                      className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-24 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-indigo-500 text-white text-base font-medium rounded-md w-24 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;