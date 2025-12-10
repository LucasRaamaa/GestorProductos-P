// src/pages/PedidosPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function PedidosPage() {
  const { hasRole, user } = useAuth();
  const isAdmin = hasRole && hasRole("ADMIN");
  const isCliente = hasRole && hasRole("CLIENTE");
  const navigate = useNavigate(); // ✅ hook dentro del componente

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/pedidos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar los pedidos");
        }

        let data = await res.json();

        // Si quisieras filtrar por cliente en el front:
        // if (isCliente && user?.id) {
        //   data = data.filter((p) => p.clienteId === user.id);
        // }

        setPedidos(data);
      } catch (err) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isCliente, user]);

  return (
    <div className="space-y-6">
      {/* Header + botón "Nuevo pedido" */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isAdmin ? "Pedidos del sistema" : "Mis pedidos"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? "Visualizá y gestioná los pedidos realizados por los clientes."
              : "Acá podés ver el estado de tus compras y pedidos."}
          </p>
        </div>

        {isCliente && (
          <button
            onClick={() => navigate("/pedidos/nuevo")}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Nuevo pedido
          </button>
        )}
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
        {loading && (
          <div className="p-6 text-center text-sm text-gray-500">
            Cargando pedidos...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            {isAdmin
              ? "Todavía no se registraron pedidos."
              : "Todavía no hiciste ningún pedido."}
          </div>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Fecha
                  </th>
                  {isAdmin && (
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Cliente
                    </th>
                  )}
                  <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Estado
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Detalle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {pedidos.map((pedido, index) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {pedido.fecha || pedido.fechaCreacion || "-"}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-gray-700">
                        {pedido.clienteNombre || pedido.clienteEmail || "-"}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill estado={pedido.estado} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-900">
                      ${" "}
                      {pedido.total?.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "0,00"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="space-y-1">
                        {pedido.detalles?.slice(0, 2).map((det, i) => (
                          <p key={i} className="text-xs text-gray-600">
                            {det.cantidad}x {det.productoNombre} ($
                            {det.subtotal})
                          </p>
                        ))}
                        {pedido.detalles && pedido.detalles.length > 2 && (
                          <p className="text-xs text-gray-400">
                            + {pedido.detalles.length - 2} ítems más
                          </p>
                        )}
                      </div>
                    </td>
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

function StatusPill({ estado }) {
  const st = (estado || "").toUpperCase();

  let classes = "bg-gray-100 text-gray-700";
  if (st === "PENDIENTE") {
    classes = "bg-amber-50 text-amber-700";
  } else if (st === "COMPLETADO" || st === "ENTREGADO") {
    classes = "bg-emerald-50 text-emerald-700";
  } else if (st === "CANCELADO") {
    classes = "bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {estado || "Desconocido"}
    </span>
  );
}
