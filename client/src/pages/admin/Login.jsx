import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/http";
import { AuthCtx } from "../../context/AuthContext";

export default function Login() {
  const { login, setUser } = useContext(AuthCtx);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async () => {
    setError(null);
    try {
      const r = await fetch(API("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const d = await r.json();

      if (d.token) {
        // save token in context
        login(d.token);

        // save user info in context/localStorage
        if (d.user) {
          setUser?.(d.user);
          localStorage.setItem("user", JSON.stringify(d.user));
        }

        // redirect to home
        navigate("/");
      } else {
        setError(d.error || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button onClick={submit}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
