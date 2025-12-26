import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "owner" | "tenant";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("owner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f6f8",
    },
    card: {
      width: "350px",
      padding: "30px",
      borderRadius: "10px",
      background: "#fff",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      background: "#2563eb",
      color: "#fff",
      cursor: "pointer",
    },
    error: {
      color: "red",
      marginBottom: "10px",
    },
    switch: {
      marginTop: "15px",
      fontSize: "14px",
      textAlign: "center",
    },
    link: {
      color: "#2563eb",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin
      ? "http://localhost:6876/api/auth/login"
      : "http://localhost:6876/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin) {
        if (role === "owner") {
          navigate("/dashboard_owner");
        } else {
          navigate("/dashboard_tenant");
        }
      } else {
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={styles.input}
        >
          <option value="owner">Owner</option>
          <option value="tenant">Tenant</option>
        </select>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p style={styles.switch}>
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
