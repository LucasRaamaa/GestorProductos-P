// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalPedidos: 0,
    pedidosPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = hasRole && hasRole("ADMIN");
  const isCliente = hasRole && hasRole("CLIENTE");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [productosRes, pedidosRes] = await Promise.all([
          fetch(`${API_URL}/api/productos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/pedidos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const productos = await productosRes.json();
        const pedidos = await pedidosRes.json();

        const pedidosPendientes = pedidos.filter(
          (p) => p.estado === "PENDIENTE"
        ).length;

        setStats({
          totalProductos: productos.length,
          totalPedidos: pedidos.length,
          pedidosPendientes,
        });
      } catch (e) {
        // podrías loguear error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            {isAdmin ? "Panel de administrador" : "Panel de usuario"}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            Hola, {user?.nombre || user?.username || "usuario"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Acá podés ver un resumen de la actividad del sistema.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Productos"
          value={stats.totalProductos}
          helper="Productos activos en el catálogo"
        />
        <StatCard
          label="Pedidos"
          value={stats.totalPedidos}
          helper="Pedidos registrados en el sistema"
        />
        <StatCard
          label="Pendientes"
          value={stats.pedidosPendientes}
          helper="Pedidos aún sin completar"
          accent="amber"
        />
      </div>

      {/* Bloques según rol */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {isAdmin && (
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Atajos rápidos (ADMIN)
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gestioná el catálogo y el estado de los pedidos.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Administrar productos y stock</li>
              <li>• Revisar pedidos pendientes</li>
              <li>• Ver actividad general del sistema</li>
            </ul>
          </div>
        )}

        {isCliente && (
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              Tu actividad (CLIENTE)
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Usá este panel para seguir tus pedidos y crear nuevos.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Crear nuevos pedidos</li>
              <li>• Ver historial de pedidos</li>
              <li>• Consultar el estado actual de tus compras</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, helper, accent = "indigo" }) {
  const accentClasses =
    accent === "amber"
      ? "bg-amber-50 text-amber-700"
      : accent === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-indigo-50 text-indigo-700";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium leading-5 tracking-wide bg-gray-50 text-gray-500">
        {helper}
      </p>
      <span className={`mt-3 inline-flex h-2 w-10 rounded-full ${accentClasses}`} />
    </div>
  );
}
