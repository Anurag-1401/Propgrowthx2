import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Lock, UserCogIcon} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import "../styles/authPage.css";

type Role = "owner" | "tenant";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("owner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [forgot,setForgot] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);



   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      sessionStorage.setItem("token", data.token);

      if (isLogin) {
        navigate(role === "owner" ? "/dashboard/owner" : "/dashboard_tenant");
      } else {
        setIsLogin(true);
        setMessage("Registration successful. Please login.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/oauth2/authorize/google";
  };


  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email ,password}),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Password reset link sent to your email");
    } catch (err) {
      setError(err.message);
    }
  };

  const sendOtp = async () => {
  if (!email) {
    setError("Please enter email first");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setOtpSent(true);
    setMessage("OTP sent to your email");
  } catch (err) {
    setError(err.message);
  }
};


const verifyOtp = async () => {
  if (!otp) {
    setError("Please enter OTP");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setOtpVerified(true);
    setMessage("OTP verified successfully");
  } catch (err) {
    setError(err.message);
  }
};


  return (
  <div className="auth-container">
    <form onSubmit={handleSubmit} className="auth-card">
      <div className="auth-header">
        <Home size={32} color="#2563eb" />
      </div>

      <h2>{isLogin ? "Login" : "Register"}</h2>
      <h5>Enter your credentials</h5>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="input-group">
        <User />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
      </div>

      {!forgot && <div className="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
      </div>}

      {!isLogin && (
        <div>
          {/* {!otpSent && (
          <button style={{marginBottom:10}}
            type="button"
            className="auth-btn"
            onClick={sendOtp}
          >
            Send OTP
          </button>
        )} */}

    {/* {otpSent && !otpVerified && (
      <>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="auth-input"
          />
        </div>

        {!otpVerified &&  <button
          type="button" style={{marginBottom:10}}
          className="auth-btn"
          onClick={verifyOtp}
        >
          Verify OTP
        </button>}
      </>
    )} */}
        <div className="input-group">
          <UserCogIcon />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="auth-input"
          >
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
          </select>
        </div>
      </div>
      )}

      {isLogin && (
        <>
        {!forgot && <div className="forgot-password" onClick={()=>setForgot(true)}>
          Forgot password?
        </div>}
      
        {forgot && (
          <div style={{ display: "block" }}>
          <div className="input-group">
        <Lock />
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        </div>
        <button type="button" onClick={handleForgotPassword} className="auth-btn">
          Reset Password
        </button>
        </div>
        )}
        </>
      )}

      {!forgot && <button type="submit" disabled={loading} className="auth-btn">
        {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
      </button>}

      <div className="divider">OR</div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="google-btn"
      >
        <FcGoogle size={20} />
        Continue with Google
      </button>


      <p className="switch-text">
        {isLogin ? "New user?" : "Already have an account?"}{" "}
        <span
          className="switch-link"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </form>
  </div>
);

};

export default AuthPage;
