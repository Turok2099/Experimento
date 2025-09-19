import React, { useEffect, useState } from "react";
import styles from "./ClassesManagement.module.scss";

// DTO simplificado del backend
interface ClassDto {
    id: number;
    title: string;
    description: string;
    date: string;
    capacity: number;
    status: "active" | "inactive";
}

const ClassesManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para editar clase
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [formData, setFormData] = useState<Partial<ClassDto>>({});

  // 🔹 Obtener clases al cargar componente
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/classes/admin", { credentials: "include" });
      if (!res.ok) throw new Error("Error al obtener clases");
      const data = await res.json();
      setClasses(data.items || data); // Ajusta si backend devuelve paginado
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Activar/desactivar clase
  const handleToggleStatus = async (id: number, currentStatus: ClassDto["status"]) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/classes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cambiar estado de clase");
      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Guardar edición
  const handleSaveEdit = async () => {
    if (!editingClass) return;
    try {
      const res = await fetch(`/classes/${editingClass.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al editar clase");
      setEditingClass(null);
      setFormData({});
      fetchClasses();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Cargando clases...</p>;

  return (
    <div className={styles.container}>
      <h2>Gestión de Clases</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                No hay clases registradas.
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.title}</td>
                <td>{new Date(cls.date).toLocaleString()}</td>
                <td>{cls.capacity}</td>
                <td>{cls.status}</td>
                <td className={styles.actions}>
                  {/* Botón Editar */}
                  <button onClick={() => {
                    setEditingClass(cls);
                    setFormData({
                      title: cls.title,
                      description: cls.description,
                      date: cls.date,
                      capacity: cls.capacity,
                    });
                  }}>
                    Editar
                  </button>

                  {/* Botón Activar/Desactivar */}
                  <button
                    onClick={() => handleToggleStatus(cls.id, cls.status)}
                    className={
                      cls.status === "active"
                        ? styles.deactivate
                        : styles.activate
                    }
                  >
                    {cls.status === "active" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal / Formulario de Edición */}
      {editingClass && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Editar Clase</h3>
            <label>
              Título:
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </label>
            <label>
              Descripción:
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </label>
            <label>
              Fecha:
              <input
                type="datetime-local"
                value={formData.date ? formData.date.substring(0, 16) : ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </label>
            <label>
              Capacidad:
              <input
                type="number"
                value={formData.capacity || ""}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) })
                }
              />
            </label>

            <div className={styles.modalActions}>
              <button onClick={handleSaveEdit} className={styles.save}>
                Guardar
              </button>
              <button
                onClick={() => setEditingClass(null)}
                className={styles.cancel}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesManagement;
