import React, { useState, useEffect } from "react";
import styles from "./ExercisesManagement.module.scss";
import { useAuth } from "@/context/AuthContext";

interface Exercise {
  id: string;
  grupo: string;
  imagen_grupo?: string;
  ejercicio: string;
  imagen_ejercicio?: string;
  categoria: string;
  is_active: boolean;
  fuerza_series?: number;
  fuerza_repeticiones?: number;
  hipertrofia_series?: number;
  hipertrofia_repeticiones?: number;
  resistencia_series?: number;
  resistencia_repeticiones?: string;
  created_at: string;
  updated_at: string;
}

const ExercisesManagement: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState<Partial<Exercise>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const { userData } = useAuth();

  // Cargar ejercicios
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises`, {
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al obtener ejercicios");

      const data = await res.json();
      console.log("📊 Respuesta del servidor:", data);

      // Si la respuesta tiene un array de ejercicios, usarlo
      if (Array.isArray(data)) {
        setExercises(data);
      } else if (data.data && Array.isArray(data.data)) {
        setExercises(data.data);
      } else {
        console.warn("Formato de respuesta inesperado:", data);
        setExercises([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [userData?.token]);

  // Crear ejercicio
  const handleCreate = async () => {
    try {
      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al crear ejercicio: ${res.status} ${errorText}`);
      }

      setShowAddForm(false);
      setFormData({});
      fetchExercises();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  // Actualizar ejercicio
  const handleUpdate = async () => {
    if (!editingExercise) return;

    try {
      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises/${editingExercise.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Error al actualizar ejercicio: ${res.status} ${errorText}`
        );
      }

      setEditingExercise(null);
      setFormData({});
      fetchExercises();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  // Cambiar estado activo/inactivo
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({ is_active: !currentStatus }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al cambiar estado: ${res.status} ${errorText}`);
      }

      fetchExercises();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  // Eliminar ejercicio
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este ejercicio?"))
      return;

    try {
      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exercises/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Error al eliminar ejercicio: ${res.status} ${errorText}`
        );
      }

      fetchExercises();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Cargando ejercicios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Gestión de Ejercicios</h2>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          + Agregar Ejercicio
        </button>
      </div>

      {/* Formulario de agregar/editar */}
      {(showAddForm || editingExercise) && (
        <div className={styles.formContainer}>
          <h3>{editingExercise ? "Editar Ejercicio" : "Agregar Ejercicio"}</h3>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Grupo Muscular:</label>
              <select
                value={formData.grupo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, grupo: e.target.value })
                }
              >
                <option value="">Seleccionar grupo</option>
                <option value="PECHO">PECHO</option>
                <option value="BRAZO">BRAZO</option>
                <option value="TRICEP">TRICEP</option>
                <option value="ESPALDA">ESPALDA</option>
                <option value="PIERNA">PIERNA</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Nombre del Ejercicio:</label>
              <input
                type="text"
                value={formData.ejercicio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ejercicio: e.target.value })
                }
                placeholder="Ej: Press de banca con barra"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría:</label>
              <select
                value={formData.categoria || "muscular"}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
              >
                <option value="muscular">Muscular</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Imagen del Grupo (URL):</label>
              <input
                type="text"
                value={formData.imagen_grupo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imagen_grupo: e.target.value })
                }
                placeholder="/rutina/filtro2/pecho.png"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Imagen del Ejercicio (URL):</label>
              <input
                type="text"
                value={formData.imagen_ejercicio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imagen_ejercicio: e.target.value })
                }
                placeholder="/rutina/filtro2/Press de banca con barra.png"
              />
            </div>

            {/* Campos para ejercicios musculares */}
            {formData.categoria === "muscular" && (
              <>
                <div className={styles.formGroup}>
                  <label>Fuerza - Series:</label>
                  <input
                    type="number"
                    value={formData.fuerza_series || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fuerza_series: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Fuerza - Repeticiones:</label>
                  <input
                    type="number"
                    value={formData.fuerza_repeticiones || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fuerza_repeticiones: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Hipertrofia - Series:</label>
                  <input
                    type="number"
                    value={formData.hipertrofia_series || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hipertrofia_series: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Hipertrofia - Repeticiones:</label>
                  <input
                    type="number"
                    value={formData.hipertrofia_repeticiones || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hipertrofia_repeticiones: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* Campos para ejercicios cardiovasculares */}
            {formData.categoria === "cardio" && (
              <>
                <div className={styles.formGroup}>
                  <label>Resistencia - Series:</label>
                  <input
                    type="number"
                    value={formData.resistencia_series || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resistencia_series: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Resistencia - Repeticiones:</label>
                  <input
                    type="text"
                    value={formData.resistencia_repeticiones || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resistencia_repeticiones: e.target.value,
                      })
                    }
                    placeholder="30 min"
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.saveButton}
              onClick={editingExercise ? handleUpdate : handleCreate}
            >
              {editingExercise ? "Actualizar" : "Crear"}
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setShowAddForm(false);
                setEditingExercise(null);
                setFormData({});
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de ejercicios */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Ejercicio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No hay ejercicios registrados.
                </td>
              </tr>
            ) : (
              exercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td>{exercise.grupo}</td>
                  <td>{exercise.ejercicio}</td>
                  <td>{exercise.categoria}</td>
                  <td>
                    <span
                      className={
                        exercise.is_active ? styles.active : styles.inactive
                      }
                    >
                      {exercise.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setEditingExercise(exercise);
                        setFormData(exercise);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleToggleStatus(exercise.id, exercise.is_active)
                      }
                      className={
                        exercise.is_active ? styles.deactivate : styles.activate
                      }
                    >
                      {exercise.is_active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(exercise.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExercisesManagement;
