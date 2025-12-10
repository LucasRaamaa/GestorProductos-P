import { useState, useEffect } from 'react';

export default function ProductoForm({ initialData, onSubmit }) {
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: ''
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((Form) => ({
            ...Form,
            [e.target.name]: e.target.value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div>
        <label>Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Precio</label>
        <input
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Stock</label>
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
}
