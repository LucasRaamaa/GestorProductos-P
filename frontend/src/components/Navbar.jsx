import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-wide hover:text-blue-400 transition-colors"
        >
          GestorProductos
        </Link>

        {isAuthenticated && (
          <div className="flex gap-3 text-sm">
            <Link className="hover:text-blue-400" to="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-blue-400" to="/productos">
              Productos
            </Link>
            <Link className="hover:text-blue-400" to="/pedidos">
              Pedidos
            </Link>
          </div>
        )}
      </div>

      <div>
        {!isAuthenticated ? (
          <Link
            to="/login"
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logout}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-sm font-medium transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
