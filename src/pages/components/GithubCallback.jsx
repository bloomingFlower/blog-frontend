import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from './api';
import LoadingIndicator from './LoadingIndicator';
import { AuthContext } from './AuthContext';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        console.error('GitHub login error:', error, errorDescription);
        toast.error(`GitHub login error: ${errorDescription || error}`);
        navigate('/login');
        return;
      }

      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code && state) {
        try {
          const response = await api.get(`/api/v1/auth/github/callback?code=${code}&state=${state}`);
          const { token, user } = response.data;

          if (token && user) {
            // Save information to session storage
            sessionStorage.setItem('jwt', token);
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('username', user.first_name || user.login);
            sessionStorage.setItem('isLoggedIn', 'true');

            // Update AuthContext
            setIsLoggedIn(true);

            toast.success('GitHub login successful!');
            navigate('/');  // Redirect to the home page
          } else {
            toast.error('Failed to receive GitHub login information.');
            navigate('/login');
          }
        } catch (error) {
          console.error('An error occurred while processing the GitHub callback:', error);
          toast.error('An error occurred while processing the GitHub callback.');
          navigate('/login');
        }
      }
    };

    handleGitHubCallback();
  }, [navigate, setIsLoggedIn]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center">
        <LoadingIndicator />
        <p className="text-white text-xl font-semibold">Processing GitHub login...</p>
        <p className="text-white text-sm mt-2">Please wait a moment.</p>
      </div>
    </div>
  );
};

export default GitHubCallback;