// src/pages/CrearPedidoPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function CrearPedidoPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Cargar productos
  useEffect(() => {
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

        // Agregamos campo auxiliar cantidadSeleccionada
        const productosConCantidad = data.map((p) => ({
          ...p,
          cantidadSeleccionada: 0,
        }));

        setProductos(productosConCantidad);
      } catch (err) {
        setError(err.message || "Error inesperado al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleCantidadChange = (id, value) => {
    const cantidad = Number(value);
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              cantidadSeleccionada:
                isNaN(cantidad) || cantidad < 0 ? 0 : cantidad,
            }
          : p
      )
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const items = productos
    .filter((p) => p.cantidadSeleccionada > 0)
    .map((p) => ({
      productoId: p.id,
      cantidad: p.cantidadSeleccionada,
    }));

  if (items.length === 0) {
    setError("Seleccioná al menos un producto con cantidad mayor a 0.");
    return;
  }

  // Validación opcional de stock
  for (const p of productos) {
    if (p.cantidadSeleccionada > p.stock) {
      setError(
        `La cantidad de "${p.nombre}" supera el stock disponible (${p.stock}).`
      );
      return;
    }
  }

  try {
    setSaving(true);
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error respuesta backend:", text);
      throw new Error("No se pudo crear el pedido");
    }

    setSuccess("Pedido creado correctamente.");

    setTimeout(() => navigate("/pedidos"), 800);
  } catch (err) {
    setError(err.message || "Error al crear el pedido");
  } finally {
    setSaving(false);
  }
};

  const handleCancel = () => {
    navigate("/pedidos");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Nuevo pedido</h1>
        <p className="mt-1 text-sm text-gray-500">
          Seleccioná los productos y las cantidades para generar tu pedido.
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
        {loading && (
          <p className="text-sm text-gray-500">Cargando productos...</p>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {!loading && productos.length === 0 && !error && (
          <p className="text-sm text-gray-500">
            No hay productos disponibles para realizar un pedido.
          </p>
        )}

        {!loading && productos.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tabla de productos para seleccionar cantidades */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {productos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {p.nombre}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        $
                        {p.precio?.toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {p.stock}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max={p.stock}
                          value={p.cantidadSeleccionada}
                          onChange={(e) =>
                            handleCantidadChange(p.id, e.target.value)
                          }
                          className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {saving ? "Creando pedido..." : "Confirmar pedido"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
