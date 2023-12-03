import React, { useState, useEffect } from "react";

function PasswordInput() {
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        let strength = 0;
        if (password.length > 5) strength++; // 길이가 5보다 크면
        if (password.match(/[a-z]/)) strength++; // 소문자가 있으면
        if (password.match(/[A-Z]/)) strength++; // 대문자가 있으면
        if (password.match(/[0-9]/)) strength++; // 숫자가 있으면
        setPasswordStrength(strength);
    }, [password]);

    return (
        <div>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="h-2 w-full border">
                <div
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    className={`h-full transition-all duration-500 ${
                        passwordStrength < 2
                            ? "bg-red-500"
                            : passwordStrength < 3
                                ? "bg-yellow-500"
                                : passwordStrength < 4
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                    }`}
                ></div>
            </div>
            <p className={`mt-2 ${
                passwordStrength < 2
                    ? "text-red-500"
                    : passwordStrength < 3
                        ? "text-yellow-500"
                        : passwordStrength < 4
                            ? "text-green-500"
                            : "text-blue-500"
            }`}>
                {passwordStrength === 1
                    ? "Weak"
                    : passwordStrength === 2
                        ? "Fair"
                        : passwordStrength === 3
                            ? "Strong"
                            : passwordStrength === 4
                                ? "Very Strong"
                                : ""}
            </p>
        </div>
    );
}

export default PasswordInput;