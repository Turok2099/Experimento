import React, { useState } from "react";
import {
  useCreateClass,
  CreateClassDto,
} from "@/hooks/superadmin/classes/useCreateClass";
import { getClassImage } from "@/helpers/classImages";
import styles from "./ClassesManagement.module.scss";

// Mapeo de goalTag del backend a nombres más amigables
const goalTagOptions = [
  {
    value: "weight_loss",
    label: "Pérdida de Peso",
    image: getClassImage("HIIT"),
  },
  {
    value: "definition",
    label: "Definición",
    image: getClassImage("FUNCIONAL"),
  },
  {
    value: "muscle_gain",
    label: "Ganancia Muscular",
    image: getClassImage("POWERLIFTING"),
  },
  { value: "mobility", label: "Movilidad", image: getClassImage("PILATES") },
  { value: "cardio", label: "Cardio", image: getClassImage("SPINNING") },
];

interface CreateClassProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ onSuccess, onCancel }) => {
  const { createClass, loading, error } = useCreateClass();
  const [formData, setFormData] = useState<CreateClassDto>({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: 20,
    goalTag: undefined,
    isActive: true,
    location: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass(formData);
      onSuccess();
    } catch (err) {
      console.error("Error creando clase:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3>Agregar Nueva Clase</h3>

        {error && <div className={styles.error}>Error: {error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Título de la clase:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Ej: Boxeo Matutino"
            />
          </label>

          <label>
            Fecha:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </label>

          <div className={styles.timeRow}>
            <label>
              Hora inicio:
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Hora fin:
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>

          <label>
            Capacidad:
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              min="1"
              max="50"
            />
          </label>

          <label>
            Ubicación:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Ej: Sala Principal"
            />
          </label>

          <label>
            Descripción:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción de la clase..."
              rows={3}
            />
          </label>

          <div className={styles.categorySection}>
            <label>Categoría de la clase:</label>
            <div className={styles.categoryGrid}>
              {goalTagOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.categoryOption} ${
                    formData.goalTag === option.value ? styles.selected : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      goalTag: option.value as any,
                    }))
                  }
                >
                  <img
                    src={option.image}
                    alt={option.label}
                    className={styles.categoryImage}
                  />
                  <span className={styles.categoryLabel}>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              Clase activa
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="submit" className={styles.save} disabled={loading}>
              {loading ? "Creando..." : "Crear Clase"}
            </button>
            <button type="button" onClick={onCancel} className={styles.cancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;

