import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("OTP sent to your email");
      setStep(2);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:8080/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(3);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await fetch("http://localhost:8080/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Password reset successfully");
      navigate("/");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {step === 1 && (
        <>
          <label className="block mb-2">Enter your registered email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block mb-2">
            Enter the 4-digit OTP sent to your email:
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            maxLength={4}
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Verify OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label className="block mb-2">Enter your new password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}
