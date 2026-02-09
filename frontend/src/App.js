import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/test")
      .then(res => setMsg(res.data.message))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Mental Health AI</h1>
      <h2>{msg}</h2>
    </div>
  );
}

export default App;
