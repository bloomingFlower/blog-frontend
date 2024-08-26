import React from 'react';
import { Link } from 'react-router-dom';

const DataHandling = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Data Handling</h1>
                    <div className="text-gray-700">
                        <p className="mb-4 text-gray-600">Last updated: 2024-08-13</p>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Email Login</h2>
                        <p className="mb-4">When you sign up with email, we collect:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Your email address</li>
                            <li>A securely hashed version of your password</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Google Login</h2>
                        <p className="mb-4">When you sign in with Google, we may access:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Your name</li>
                            <li>Your email address</li>
                            <li>Your Google profile picture (if available)</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">GitHub Login</h2>
                        <p className="mb-4">When you sign in with GitHub, we may access:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Your GitHub username</li>
                            <li>Your email address associated with your GitHub account</li>
                            <li>Your GitHub profile picture (if available)</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Data Storage and Security</h2>
                        <p className="mb-4">We store all user data securely in encrypted databases. We never share your personal information with third parties without your explicit consent, except as required by law.</p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default DataHandling;
