import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ParticlesBg from "../components/ParticlesBg";
import bg from "../assets/bg.jpg";   // 👈 background image
import "./auth-premium.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Enter Email/Phone and Password");
      return;
    }

    try {
      const res = await API.post("/register", { username, password });
      alert(res.data.msg);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
   <div
  className="auth-root"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(1)"    }}
>

      {/* Sparkle particles */}
      <ParticlesBg />

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Create Account</h2>

        {/* Username */}
        <div className="field">
          <input
            placeholder="Email or Phone"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button className="glass-btn" onClick={handleRegister}>
          Register
        </button>

        {/* Link */}
        <p className="glass-link" onClick={() => navigate("/")}>
          Already have an account?
        </p>
      </motion.div>
    </div>
  );
}
