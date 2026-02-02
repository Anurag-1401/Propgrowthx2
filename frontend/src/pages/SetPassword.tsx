import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Lock} from "lucide-react";
import "../styles/authPage.css";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { useSearchParams } from 'react-router-dom';
import { validateInvite } from "@/hooks/GenerateInvite";
import emailjs from "emailjs-com";
import { useData } from "@/context/dataContext";

const SetPassword: React.FC = () => {
  const navigate = useNavigate();
  const {setId} = useData();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [con_password, setCon_Password] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [inviteValid,setInviteValid] = useState(false);
  const [params] = useSearchParams();
  const inviteToken = params.get('token');
  const propId = params.get('propId')

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
          const hashedPassword = await bcrypt.hash(password, 10);
          const { data, error } = await supabase
            .from("profiles")
            .insert({
              email,
              role:'tenant',
              password:hashedPassword,
            })
            .select()
            .single();

            if (error) {
              setError(error.message);
              return;
            }

            console.log(data,propId);

            const {data:updatedProperty,error:updateError} = await supabase 
              .from("properties")
              .update({
                buyer_id:data.id,
                status:'occupied'
              })
              .eq("id",propId)
              .select()
              .single();

              if(updateError) console.log(updateError);

            const{data:updatedIL,error:updateILError} = await supabase
             .from("property_invites")
             .update({used:true})
             .eq("property_id",propId)
             .select()

             if(updateILError) console.log(updateILError);

             setMessage("Account Created Successfully!");
            
             await emailjs.send(
              "service_pia6efr",
              "template_wc7bzyi",
              {
                to_email: email,
                to_name: email.split("@")[0],
              },
              "msM6UBCrh8skmh2dd"
            );

          const token = `${data.id}.${data.role}.${Date.now()}`;
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("role", data.role);
          setId(data.id);
          sessionStorage.setItem("id", data.id);

          navigate("/dashboard/tenant");

        } catch (err) {
          console.log("Unexpected error:", err.message);
              setError(err.message || "Something went wrong");
        } finally {
        setLoading(false);
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

      <h2>Generate Account</h2>
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

      <div className="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
      </div>

      <div className="input-group">
        <Lock />
        <input
          type="password"
          placeholder="Confirm Password"
          value={con_password}
          onChange={(e) => setCon_Password(e.target.value)}
          required
          className="auth-input"
        />
      </div>

      {<button type="submit" disabled={loading} className="auth-btn">
        {loading ? "Please wait..." : "Generate Account"}
      </button>}
    </form>
  </div>
);

};

export default SetPassword;
