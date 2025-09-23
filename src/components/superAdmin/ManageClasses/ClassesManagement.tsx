import React, { useState } from "react";
import styles from "./ClassesManagement.module.scss";
import { useClasses, ClassDto } from "@/hooks/superadmin/classes/useClasses";
import { useUpdateClass } from "@/hooks/superadmin/classes/useUpdateClasses";
import { useAuth } from "@/context/AuthContext";

const ClassesManagement: React.FC = () => {
  const { classes, loading, error, fetchClasses } = useClasses();
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [formData, setFormData] = useState<Partial<ClassDto>>({});
  const { updateClass, loading: updating } = useUpdateClass();
  const { userData } = useAuth();

  // Cambiar estado activo/inactivo
  const handleToggleStatus = async (
    id: string,
    currentStatus: ClassDto["status"]
  ) => {
    console.log("🔄 === DEBUG TOGGLE STATUS ===");
    console.log("📥 ID:", id);
    console.log("📥 Current Status:", currentStatus);

    const newIsActive = currentStatus === "active" ? false : true;
    console.log("📤 New isActive:", newIsActive);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(userData?.token
              ? { Authorization: `Bearer ${userData.token}` }
              : {}),
          },
          body: JSON.stringify({ isActive: newIsActive }),
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.log("❌ Error response:", res.status, errorText);
        throw new Error(
          `Error al cambiar estado de clase: ${res.status} ${errorText}`
        );
      }

      const responseData = await res.json();
      console.log("✅ Success response:", responseData);

      // Refrescar la lista de clases
      console.log("🔄 Refrescando lista de clases...");
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert(
        `Error: ${err instanceof Error ? err.message : "Error desconocido"}`
      );
    }
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    if (!editingClass) return;
    try {
      await updateClass(editingClass.id, formData); // 🔥 con token incluido
      setEditingClass(null);
      setFormData({});
      fetchClasses(); // 🔄 refrescamos la tabla
    } catch (err) {
      console.error("Error guardando cambios:", err);
    }
  };

  if (loading) return <p>Cargando clases...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>Gestión de Clases</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Capacidad</th>
            <th>Coaches</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {classes.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>
                No hay clases registradas.
              </td>
            </tr>
          ) : (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.title}</td>
                <td>{new Date(cls.date).toLocaleDateString()}</td>
                <td>
                  {cls.startTime} - {cls.endTime}
                </td>
                <td>{cls.capacity}</td>
                <td>{cls.coach?.join(", ") || "-"}</td>
                <td>{cls.status}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.buttonEditar}
                    onClick={() => {
                      setEditingClass(cls);
                      setFormData({
                        title: cls.title,
                        date: cls.date,
                        startTime: cls.startTime,
                        endTime: cls.endTime,
                        capacity: cls.capacity,
                        // coach: cls.coach,
                      });
                    }}
                  >
                    Editar
                  </button>
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

      {editingClass && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Editar Clase</h3>
            <label>
              Título:
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </label>
            <label>
              Fecha:
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </label>
            <label>
              Hora inicio:
              <input
                type="time"
                value={formData.startTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </label>
            <label>
              Hora fin:
              <input
                type="time"
                value={formData.endTime || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </label>
            <label>
              Capacidad:
              <input
                type="number"
                value={formData.capacity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
              />
            </label>
            {/* <label>
              Entrenador:
              <input
                type="text"
                value={formData.coach?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({ ...formData, coach: e.target.value.split(",").map(c => c.trim()) })
                }
              />
            </label> */}
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
