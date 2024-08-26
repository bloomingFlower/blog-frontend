import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
                    <div className="text-gray-700">
                        <p className="mb-4 text-gray-600">Last updated: 2024-08-13</p>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Information We Collect</h2>
                        <p className="mb-4">We collect information you provide directly to us when you:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Create an account</li>
                            <li>Use our services</li>
                            <li>Communicate with us</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Communicate with you about our services</li>
                            <li>Protect against fraud and abuse</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Data Retention</h2>
                        <p className="mb-4">We retain your information for as long as necessary to provide our services and comply with our legal obligations.</p>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Your Rights</h2>
                        <p className="mb-4">You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;