// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import ProductosPage from "./pages/ProductosPage";
import ProductoFormPage from "./pages/ProductoFormPage";
import PedidosPage from "./pages/PedidosPage";
import Unauthorized from "./pages/Unauthorized"; // si este archivo no existe, comentalo
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import CrearPedidoPage from "./pages/CrearPedidoPage";

export default function App() {
  const { isAuthenticated } = useAuth(); // dejo solo lo que seguro usás

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          {/* LOGIN */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
            }
          />

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "CLIENTE"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* PRODUCTOS - LISTA */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "CLIENTE"]}>
                <ProductosPage />
              </ProtectedRoute>
            }
          />

          {/* NUEVO PRODUCTO (ADMIN) */}
          <Route
            path="/productos/nuevo"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductoFormPage />
              </ProtectedRoute>
            }
          />

          {/* EDITAR PRODUCTO (ADMIN) */}
          <Route
            path="/productos/:id/editar"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ProductoFormPage />
              </ProtectedRoute>
            }
          />

          {/* PEDIDOS (ADMIN + CLIENTE) */}
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "CLIENTE"]}>
                <PedidosPage />
              </ProtectedRoute>
            }
          />
          {/* CREAR PEDIDO (solo CLIENTE) */}
<Route
  path="/pedidos/nuevo"
  element={
    <ProtectedRoute allowedRoles={["CLIENTE"]}>
      <CrearPedidoPage />
    </ProtectedRoute>
  }
/>

          {/* UNAUTHORIZED (si tenés la página) */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* CUALQUIER OTRA RUTA */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
