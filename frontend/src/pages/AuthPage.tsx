import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Lock, UserCogIcon} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import "../styles/authPage.css";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { useSearchParams } from 'react-router-dom';
import { validateInvite } from "@/hooks/GenerateQrInvite";
import { useData } from "@/context/dataContext";


type Role = "owner" | "tenant";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {setId} = useData();

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
  const [inviteValid,setInviteValid] = useState(false);
  const [params] = useSearchParams();
  const inviteToken = params.get('token');

  const token = sessionStorage.getItem('token')

    useEffect(() => {
    if (!inviteToken) return;

    validateInvite(inviteToken)
      .then(() => {
        setInviteValid(true);
      })
      .catch(() => {
        setInviteValid(false);
      });
  }, [inviteToken]);



   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
      
        try {
          if (!email || !password) {
            setError("Email and password are required");
            return;
          }

          if(!isLogin){      
          const hashedPassword = await bcrypt.hash(password, 10);
          const { data, error } = await supabase
            .from("profiles")
            .insert({
              email,
              role:inviteValid ? 'tenant' : {role},
              password:hashedPassword,
            })
            .select()
            .single();

            if (error) {
              setError(error.message);
              return;
            }
             setIsLogin(true);
             setMessage("Registration successful. Please login.");
            return
          }

            const { data: user, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", email)
            .single();
      
            if (error || !user) {
                  setError("Invalid email");
                  return;
                }  
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error("Invalid password");
          }
          const token = `${user.id}.${user.role}.${Date.now()}`;
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("role", user.role);
          setId(user.id);
          sessionStorage.setItem("id", user.id);

          navigate(
            user.role === "owner"
              ? "/dashboard/owner"
              : inviteValid ? `/profile/${user.id}` : "/dashboard/tenant" 
          );

        } catch (err) {
          console.log("Unexpected error:", err.message);
              setError(err.message || "Something went wrong");
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

  useEffect(() => {
      if (token) {
        navigate('/', { replace: true });
      }
    }, [token, navigate]);

    if (token) return null;

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
            {!inviteValid && <option value="owner">Owner</option>}
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
