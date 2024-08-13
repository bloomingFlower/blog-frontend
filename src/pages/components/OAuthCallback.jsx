import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "./api";
import LoadingIndicator from "./LoadingIndicator";
import { AuthContext } from "./AuthContext";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      // Determine the provider based on the URL path
      const provider = location.pathname.includes('github') ? 'github' : 'google';

      if (error) {
        console.error(`${provider} login error:`, error, errorDescription);
        toast.error(`${provider} login error: ${errorDescription || error}`);
        navigate("/login");
        return;
      }

      if (code) {
        try {
          const response = await api.get(
            `/api/v1/auth/${provider}/callback`,
            { params: { code, state } }
          );
          const { token, user } = response.data;
          if (token && user) {
            // Save information to session storage
            sessionStorage.setItem("jwt", token);
            sessionStorage.setItem("user", JSON.stringify(user));
            sessionStorage.setItem("username", user.first_name || user.login || user.email);
            sessionStorage.setItem("isLoggedIn", "true");

            // Update AuthContext
            setIsLoggedIn(true);

            toast.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`);
            navigate("/"); // Redirect to the home page
          } else {
            toast.error(`Failed to receive ${provider} login information.`);
            navigate("/login");
          }
        } catch (error) {
          console.error(
            `An error occurred while processing the ${provider} callback:`,
            error
          );
          toast.error(
            `An error occurred while processing the ${provider} callback.`
          );
          navigate("/login");
        }
      }
    };

    handleOAuthCallback();
  }, [navigate, setIsLoggedIn, location]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex flex-col items-center justify-center text-center">
        <LoadingIndicator />
        <p className="text-white text-xl font-semibold mt-4">
          Processing OAuth login...
        </p>
        <p className="text-white text-sm mt-2">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;