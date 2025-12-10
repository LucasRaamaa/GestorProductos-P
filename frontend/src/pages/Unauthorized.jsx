import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Acceso denegado</h1>
      <p>No tenés permisos para acceder a esta sección.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
}
