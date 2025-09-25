import React, { useState, useEffect, useCallback, useRef } from "react";
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
  tiempo?: string; // Campo para ejercicios de resistencia
  image_url?: string; // Nueva columna para Cloudinary
  created_at: string;
  updated_at: string;
  // Campos para clases
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  location?: string;
  description?: string;
}

type ExerciseCategory = "hipertrofia" | "fuerza" | "resistencia";

const ExercisesManagement: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState<Partial<Exercise>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [exerciseCategory, setExerciseCategory] =
    useState<ExerciseCategory>("hipertrofia");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const { userData } = useAuth();

  // useEffect para hacer scroll cuando se activa la edición
  useEffect(() => {
    if (editingExercise) {
      // Esperar a que el DOM se actualice y luego hacer scroll
      setTimeout(() => {
        const editForm = document.getElementById("edit-form");
        if (editForm) {
          editForm.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Si no encuentra el formulario, hacer scroll al inicio
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 150); // Aumentar el tiempo para asegurar que el DOM esté listo
    }
  }, [editingExercise]);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setShowAddForm(false);
    setEditingExercise(null);
    setFormData({});
    setSelectedImage(null);
    setExerciseCategory("hipertrofia");
  }, []);

  // useEffect para manejar la tecla ESC y bloquear scroll
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (showAddForm || editingExercise)) {
        closeModal();
      }
    };

    if (showAddForm || editingExercise) {
      document.addEventListener("keydown", handleEscKey);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [showAddForm, editingExercise, closeModal]);

  // Filtrar ejercicios
  const filteredExercises = exercises.filter((exercise) => {
    const categoryMatch =
      !filterCategory ||
      exercise.categoria?.toLowerCase() === filterCategory.toLowerCase();
    const statusMatch =
      !filterStatus ||
      (filterStatus === "activo" && exercise.is_active) ||
      (filterStatus === "inactivo" && !exercise.is_active);
    return categoryMatch && statusMatch;
  });

  // Cargar ejercicios
  const fetchExercises = useCallback(async () => {
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
            Authorization: `Bearer ${userData.accessToken || userData.token}`,
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
  }, [userData?.token, userData?.accessToken]);

  useEffect(() => {
    fetchExercises();
  }, [userData?.token, fetchExercises]);

  // Crear ejercicio
  const handleCreate = async () => {
    try {
      if (!userData?.token) {
        throw new Error("Usuario no autorizado");
      }

      // Crear FormData para enviar tanto los datos como la imagen
      const formDataToSend = new FormData();

      // Campos permitidos para creación (excluir campos del sistema)
      const allowedFields = [
        "ejercicio",
        "grupo",
        "categoria",
        "hipertrofia_series",
        "hipertrofia_repeticiones",
        "fuerza_series",
        "fuerza_repeticiones",
        "resistencia_series",
        "resistencia_repeticiones",
        "tiempo",
        "isActive",
      ];

      // Agregar solo los campos permitidos
      allowedFields.forEach((key) => {
        const value = (formData as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, String(value));
        }
      });

      // Agregar la imagen si existe
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.accessToken || userData.token}`,
            // No establecer Content-Type, dejar que el navegador lo haga automáticamente para FormData
          },
          body: formDataToSend,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al crear ejercicio: ${res.status} ${errorText}`);
      }

      setShowAddForm(false);
      setFormData({});
      setSelectedImage(null);
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

      // Crear FormData para enviar tanto los datos como la imagen
      const formDataToSend = new FormData();

      // Campos permitidos para actualización (excluir campos del sistema)
      const allowedFields = [
        "ejercicio",
        "grupo",
        "categoria",
        "hipertrofia_series",
        "hipertrofia_repeticiones",
        "fuerza_series",
        "fuerza_repeticiones",
        "resistencia_series",
        "resistencia_repeticiones",
        "tiempo",
        "isActive",
      ];

      // Agregar solo los campos permitidos
      allowedFields.forEach((key) => {
        const value = (formData as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          formDataToSend.append(key, String(value));
        }
      });

      // Agregar la imagen si existe
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/exercises/${editingExercise.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userData.accessToken || userData.token}`,
            // No establecer Content-Type, dejar que el navegador lo haga automáticamente para FormData
          },
          body: formDataToSend,
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
      setSelectedImage(null);
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
            Authorization: `Bearer ${userData.accessToken || userData.token}`,
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
            Authorization: `Bearer ${userData.accessToken || userData.token}`,
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
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            id="edit-form"
            className={styles.formContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <h3>
              {editingExercise ? "Editar Ejercicio" : "Agregar Ejercicio"}
            </h3>

            <div className={styles.formGrid}>
              {/* Selección directa de categoría */}
              <div className={styles.categorySelector}>
                <h4>Selecciona el tipo de contenido:</h4>
                <div className={styles.categoryButtons}>
                  <button
                    className={`${styles.categoryButton} ${
                      exerciseCategory === "hipertrofia" ? styles.active : ""
                    }`}
                    onClick={() => setExerciseCategory("hipertrofia")}
                  >
                    Hipertrofia
                  </button>
                  <button
                    className={`${styles.categoryButton} ${
                      exerciseCategory === "fuerza" ? styles.active : ""
                    }`}
                    onClick={() => setExerciseCategory("fuerza")}
                  >
                    Fuerza
                  </button>
                  <button
                    className={`${styles.categoryButton} ${
                      exerciseCategory === "resistencia" ? styles.active : ""
                    }`}
                    onClick={() => {
                      setExerciseCategory("resistencia");
                      // Establecer valores automáticos para resistencia
                      setFormData({
                        ...formData,
                        categoria: "Resistencia",
                        grupo: "Integral",
                      });
                    }}
                  >
                    Resistencia
                  </button>
                </div>
              </div>

              {/* Campos específicos para Hipertrofia */}
              {exerciseCategory === "hipertrofia" && (
                <>
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
                    <label>Series:</label>
                    <input
                      type="number"
                      value={formData.hipertrofia_series || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hipertrofia_series: parseInt(e.target.value),
                        })
                      }
                      placeholder="Ej: 4"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeticiones:</label>
                    <input
                      type="number"
                      value={formData.hipertrofia_repeticiones || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hipertrofia_repeticiones: parseInt(e.target.value),
                        })
                      }
                      placeholder="Ej: 10"
                    />
                  </div>
                </>
              )}

              {/* Campos específicos para Fuerza */}
              {exerciseCategory === "fuerza" && (
                <>
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
                    <label>Series:</label>
                    <input
                      type="number"
                      value={formData.fuerza_series || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fuerza_series: parseInt(e.target.value),
                        })
                      }
                      placeholder="Ej: 5"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Repeticiones:</label>
                    <input
                      type="number"
                      value={formData.fuerza_repeticiones || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fuerza_repeticiones: parseInt(e.target.value),
                        })
                      }
                      placeholder="Ej: 3"
                    />
                  </div>
                </>
              )}

              {/* Campos específicos para Resistencia */}
              {exerciseCategory === "resistencia" && (
                <>
                  <div className={styles.formGroup}>
                    <label>Máquina:</label>
                    <input
                      type="text"
                      value={formData.ejercicio || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ejercicio: e.target.value,
                          categoria: "Resistencia", // Automático
                          grupo: "Integral", // Automático
                        })
                      }
                      placeholder="Ej: Cinta de correr, Bicicleta estática, Elíptica"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tiempo:</label>
                    <select
                      value={formData.tiempo || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, tiempo: e.target.value })
                      }
                    >
                      <option value="">Seleccionar tiempo</option>
                      <option value="15 min">15 minutos</option>
                      <option value="30 min">30 minutos</option>
                      <option value="45 min">45 minutos</option>
                      <option value="60 min">1 hora</option>
                      <option value="75 min">1 hora 15 minutos</option>
                      <option value="90 min">1 hora 30 minutos</option>
                      <option value="105 min">1 hora 45 minutos</option>
                      <option value="120 min">2 horas</option>
                    </select>
                  </div>
                </>
              )}

              {/* Campo para subir imagen */}
              {exerciseCategory && (
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
              )}
            </div>

            <div className={styles.formActions}>
              <button
                className={styles.saveButton}
                onClick={() => {
                  if (editingExercise) {
                    handleUpdate();
                  } else {
                    handleCreate();
                  }
                }}
              >
                {editingExercise ? "Actualizar" : "Crear"}
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label htmlFor="categoryFilter">Filtrar por Categoría:</label>
          <select
            id="categoryFilter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todas las categorías</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="fuerza">Fuerza</option>
            <option value="resistencia">Resistencia</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="statusFilter">Filtrar por Estado:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <button
            onClick={() => {
              setFilterCategory("");
              setFilterStatus("");
            }}
            className={styles.clearFiltersButton}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

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
            {filteredExercises.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No hay ejercicios registrados.
                </td>
              </tr>
            ) : (
              filteredExercises.map((exercise) => (
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
