import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      console.log("Respuesta login:", res.data);

      const token = res.data.token;         // Backend devuelve { "token": "..." }
      login(token);                         // actualiza contexto y localStorage

      navigate("/dashboard");
    } catch (err) {
      console.error("Error en login:", err);

      if (err.response) {
        setError(
          `Error ${err.response.status}: ${JSON.stringify(
            err.response.data
          )}`
        );
      } else if (err.request) {
        setError("No se obtuvo respuesta del servidor. ¿Backend levantado?");
      } else {
        setError("Error al preparar la petición.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          {error}
        </p>
      )}
    </div>
  );
}


