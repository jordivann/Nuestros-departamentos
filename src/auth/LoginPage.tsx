import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
      if (user) navigate("/admin/departamentos");
    }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  }

  // 👉 Redirección automática cuando el usuario inicia sesión
  useEffect(() => {
    if (user) navigate("/admin/departamentos");
  }, [user, navigate]);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">
        <h2>Iniciar Sesión</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
