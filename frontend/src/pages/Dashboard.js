import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    API.get("/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMsg(res.data.msg))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <p>{msg}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
