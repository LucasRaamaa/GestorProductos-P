// src/pages/ProductoFormPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function ProductoFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [error, setError] = useState("");

  // Cargar datos si es edición
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoadingInitial(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("No se pudo cargar el producto");
        }

        const data = await res.json();
        setForm({
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          precio: data.precio ?? "",
          stock: data.stock ?? "",
        });
      } catch (err) {
        setError(err.message || "Error al cargar el producto");
      } finally {
        setLoadingInitial(false);
      }
    };

    if (isEdit) {
      fetchProducto();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones simples
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.precio || Number(form.precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }
    if (form.stock === "" || Number(form.stock) < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/productos${isEdit ? `/${id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo guardar el producto");
      }

      navigate("/productos");
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/productos");
  };

  if (loadingInitial) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 text-sm text-gray-500">
        Cargando datos del producto...
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? "Editar producto" : "Nuevo producto"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Completá los campos para {isEdit ? "modificar" : "crear"} un producto.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ej: Monitor 24''"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={form.descripcion}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Descripción breve del producto"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="precio"
                className="block text-sm font-medium text-gray-700"
              >
                Precio *
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">
                  $
                </span>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.precio}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white pl-7 pr-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock *
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

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
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading
                ? isEdit
                  ? "Guardando..."
                  : "Creando..."
                : isEdit
                ? "Guardar cambios"
                : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
