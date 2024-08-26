import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
                    <div className="text-gray-700">
                        <p className="mb-4 text-gray-600">Last updated: 2024-08-13</p>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Acceptance of Terms</h2>
                        <p className="mb-4">By accessing or using our services, you agree to be bound by these Terms of Service.</p>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. User Responsibilities</h2>
                        <p className="mb-4">You are responsible for:</p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Maintaining the confidentiality of your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Complying with all applicable laws and regulations</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Intellectual Property</h2>
                        <p className="mb-4">Our services and their contents are protected by copyright, trademark, and other laws.</p>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Termination</h2>
                        <p className="mb-4">We may terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.</p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-500">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
