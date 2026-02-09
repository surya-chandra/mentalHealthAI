import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBg from "../components/ParticlesBg";
import bg from "../assets/bg.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `linear-gradient(rgba(8,12,20,0.75), rgba(8,12,20,0.85)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      {/* Particle background */}
      <ParticlesBg />

      <motion.div
        className="glass"
        style={{
          width: 380,
          padding: 32,
          textAlign: "center",
          position: "relative",
          zIndex: 2
        }}
        initial={{ opacity: 0, y: 70, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: 5 }}>Welcome Back</h2>
        <p style={{ opacity: 0.65, fontSize: 13, marginBottom: 12 }}>
          Sign in to continue
        </p>

        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          className="btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
        >
          Login
        </motion.button>

        <p
          className="link"
          style={{ marginTop: 12 }}
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Register
        </p>
      </motion.div>
    </div>
  );
}
