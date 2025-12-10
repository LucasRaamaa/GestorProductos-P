import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const res = await api.get("/api/productos");
      setProductos(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener productos");
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await api.delete(`/api/productos/${id}`);
      cargarProductos();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Nombre</th>
              <th className="px-4 py-2 text-right font-semibold">Precio</th>
              <th className="px-4 py-2 text-right font-semibold">Stock</th>
              {hasRole("ADMIN") && (
                <th className="px-4 py-2 text-center font-semibold">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {productos.map((p, idx) => (
              <tr
                key={p.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2 text-right">${p.precio}</td>
                <td className="px-4 py-2 text-right">{p.stock}</td>

                {hasRole("ADMIN") && (
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/productos/editar/${p.id}`)}
                      className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700 text-white font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td
                  colSpan={hasRole("ADMIN") ? 5 : 4}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


