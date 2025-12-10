// src/pages/ProductosPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const isAdmin = hasRole && hasRole("ADMIN");

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/productos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al cargar los productos");
      }

      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este producto?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

      // Refrescamos lista
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || "Error al eliminar");
    }
  };

  const handleEdit = (id) => {
    navigate(`/productos/${id}/editar`);
  };

  const handleCreate = () => {
    navigate("/productos/nuevo");
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Productos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administrá el catálogo de productos disponibles en el sistema.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="text-lg leading-none">＋</span>
            Nuevo producto
          </button>
        )}
      </div>

      {/* Card contenedora */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {/* Estados de carga / error / vacío */}
        {loading && (
          <div className="p-6 text-center text-sm text-gray-500">
            Cargando productos...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && productos.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No hay productos cargados.
            {isAdmin && (
              <>
                {" "}
                <button
                  onClick={handleCreate}
                  className="ml-1 text-indigo-600 hover:underline"
                >
                  Crear el primero
                </button>
              </>
            )}
          </div>
        )}

        {/* Tabla responsive */}
        {!loading && !error && productos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Descripción
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Precio
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Stock
                  </th>
                  {isAdmin && (
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {productos.map((producto, index) => (
                  <tr
                    key={producto.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {producto.nombre}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">
                        {producto.descripcion || "-"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-900">
                      ${" "}
                      {producto.precio?.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          producto.stock === 0
                            ? "bg-red-50 text-red-700"
                            : producto.stock < 5
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {producto.stock}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(producto.id)}
                            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

