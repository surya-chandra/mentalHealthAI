import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBg from "../components/ParticlesBg";
import bg from "../assets/bg.jpg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto login if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) return alert("Enter credentials");

    setLoading(true);

    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid username or password");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `linear-gradient(rgba(8,12,20,0.75), rgba(8,12,20,0.9)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <ParticlesBg />

      <motion.div
        className="glass"
        style={{
          width: 390,
          padding: 34,
          textAlign: "center",
          position: "relative",
          zIndex: 2
        }}
        initial={{ opacity: 0, y: 80, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: 6 }}>Welcome Back</h2>
        <p style={{ opacity: 0.65, fontSize: 13, marginBottom: 16 }}>
          Continue your consistency journey
        </p>

        {/* USERNAME */}
       {/* EMAIL / PHONE */}
<div className="field">
  <input
    type="text"
    placeholder="Email or Phone"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="premium-input"
    style={{
      width: "100%",
      height: 52,
      borderRadius: 16,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.18)",
      color: "#fff",
      paddingLeft: 14,
      fontSize: 14,
      outline: "none"
    }}
  />
</div>


{/* PASSWORD */}
<div className="field" style={{ marginTop: 14 }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="premium-input"
    style={{
      width: "100%",
      height: 52,
      borderRadius: 16,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.18)",
      color: "#fff",
      paddingLeft: 14,
      paddingRight: 42,
      fontSize: 14,
      outline: "none"
    }}
  />

  {/* Eye Toggle */}
  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      opacity: 0.6,
      fontSize: 15,
      color: "#fff"
    }}
  >
    {showPassword ? "🙈" : "👁"}
  </span>
</div>



        {/* LOGIN BUTTON */}
        <motion.button
          className="btn premium-btn"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogin}
        >
          {loading ? "Signing in..." : "Login"}
        </motion.button>

        {/* FORGOT PASSWORD */}
        <p
          style={{
            marginTop: 10,
            fontSize: 12,
            opacity: 0.6,
            cursor: "pointer"
          }}
          onClick={() => alert("Forgot password (SMTP feature coming)")}
        >
          Forgot Password?
        </p>

        {/* REGISTER */}
        <p
          className="link"
          style={{ marginTop: 10 }}
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Register
        </p>
      </motion.div>
    </div>
  );
}
