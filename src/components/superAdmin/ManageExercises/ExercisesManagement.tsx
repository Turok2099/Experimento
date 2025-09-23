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
  image_url?: string; // Nueva columna para Cloudinary
  created_at: string;
  updated_at: string;
}

interface Class {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  trainerName?: string;
  trainerId?: string;
  location?: string;
  description?: string;
  is_active: boolean;
  image_url?: string; // Nueva columna para Cloudinary
  created_at: string;
  updated_at: string;
}

type ContentType = "exercises" | "classes";

const ExercisesManagement: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState<Partial<Exercise & Class>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("exercises");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { userData } = useAuth();

  // Cargar ejercicios
  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises`,
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al obtener ejercicios");

      const data = await res.json();
      console.log("📊 Respuesta del servidor:", data);

      // El endpoint ahora devuelve directamente el array de ejercicios
      if (Array.isArray(data)) {
        setExercises(data);
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

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
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises/${editingExercise.id}`,
        {
          method: "PUT",
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
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify({ isActive: !currentStatus }),
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
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises/${id}`,
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
        <h2>Gestión de Contenido</h2>
        
        {/* Selector de tipo de contenido */}
        <div className={styles.contentTypeSelector}>
          <button
            className={`${styles.typeButton} ${contentType === "exercises" ? styles.active : ""}`}
            onClick={() => setContentType("exercises")}
          >
            Ejercicios
          </button>
          <button
            className={`${styles.typeButton} ${contentType === "classes" ? styles.active : ""}`}
            onClick={() => setContentType("classes")}
          >
            Clases
          </button>
        </div>
        
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          + Agregar {contentType === "exercises" ? "Ejercicio" : "Clase"}
        </button>
      </div>

      {/* Formulario de agregar/editar */}
      {(showAddForm || editingExercise || editingClass) && (
        <div className={styles.formContainer}>
          <h3>
            {editingExercise 
              ? "Editar Ejercicio" 
              : editingClass 
              ? "Editar Clase" 
              : `Agregar ${contentType === "exercises" ? "Ejercicio" : "Clase"}`}
          </h3>

          <div className={styles.formGrid}>
            {/* Campos específicos para Ejercicios */}
            {contentType === "exercises" && (
              <>
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
              </>
            )}

            {/* Campos específicos para Clases */}
            {contentType === "classes" && (
              <>
                <div className={styles.formGroup}>
                  <label>Título de la Clase:</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Ej: Yoga Matutino"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Fecha:</label>
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Hora de Inicio:</label>
                  <input
                    type="time"
                    value={formData.startTime || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Hora de Fin:</label>
                  <input
                    type="time"
                    value={formData.endTime || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Capacidad:</label>
                  <input
                    type="number"
                    value={formData.capacity || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: parseInt(e.target.value) })
                    }
                    placeholder="Ej: 20"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Ubicación:</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Ej: Sala Principal"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Descripción:</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descripción de la clase..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Campo único para subir imagen */}
            <div className={styles.formGroup}>
              <label>Imagen:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setSelectedImage(file || null);
                }}
              />
              {selectedImage && (
                <p className={styles.fileInfo}>
                  Archivo seleccionado: {selectedImage.name}
                </p>
              )}
            </div>

            {/* Campos para ejercicios musculares - Solo para ejercicios */}
            {contentType === "exercises" && formData.categoria === "muscular" && (
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

            {/* Campos para ejercicios cardiovasculares - Solo para ejercicios */}
            {contentType === "exercises" && formData.categoria === "cardio" && (
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
              onClick={() => {
                if (contentType === "exercises") {
                  if (editingExercise) {
                    handleUpdate();
                  } else {
                    handleCreate();
                  }
                } else {
                  // TODO: Implementar funciones para clases
                  alert("Funcionalidad para clases en desarrollo");
                }
              }}
            >
              {editingExercise || editingClass ? "Actualizar" : "Crear"}
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                setShowAddForm(false);
                setEditingExercise(null);
                setEditingClass(null);
                setFormData({});
                setSelectedImage(null);
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
