import React, { useState, useEffect } from "react";

function PasswordInput({ onChange, className, ...props }) {
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    let strength = 0;
    if (password.length > 7) strength++; // 길이가 8 이상이면
    if (password.match(/[a-z]/)) strength++; // 소문자가 있으면
    if (password.match(/[A-Z]/)) strength++; // 대문자가 있으면
    if (password.match(/[0-9]/)) strength++; // 숫자가 있으면
    if (password.match(/[!@#$%^&*]/)) strength++; // 특수문자가 있으면
    setPasswordStrength(strength);
  }, [password]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    onChange(newPassword);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        onBlur={handleBlur}
        className={className}
        {...props}
      />
      {isTouched && password.length === 0 && (
        <p className="text-red-500 text-xs mt-1">Please enter a password</p>
      )}
      {password.length > 0 && (
        <>
          <div className="h-1 w-full mt-1">
            <div
              style={{ width: `${(passwordStrength / 5) * 100}%` }}
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
          <p
            className={`text-xs mt-1 ${
              passwordStrength < 2
                ? "text-red-500"
                : passwordStrength < 3
                ? "text-yellow-500"
                : passwordStrength < 4
                ? "text-green-500"
                : "text-blue-500"
            }`}
          >
            {passwordStrength === 0
              ? "Very Weak"
              : passwordStrength === 1
              ? "Weak"
              : passwordStrength === 2
              ? "Fair"
              : passwordStrength === 3
              ? "Good"
              : passwordStrength === 4
              ? "Strong"
              : "Very Strong"}
          </p>
        </>
      )}
    </div>
  );
}

export default PasswordInput;
