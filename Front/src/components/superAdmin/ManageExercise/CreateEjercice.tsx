'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import styles from './CreateEjercice.module.scss'

type FormDataState = {
  name: string;
  description: string;
  muscleGroup: string;
};

export default function CrearEjercicioForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    description: "",
    muscleGroup: "pecho",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || !formData.name) {
      alert("Por favor, completa el nombre y selecciona una imagen.");
      return;
    }
    setIsLoading(true);

    const dataToSend = new FormData();
    dataToSend.append("image", selectedFile);
    dataToSend.append("name", formData.name);
    dataToSend.append("description", formData.description);
    dataToSend.append("muscleGroup", formData.muscleGroup);

    try {
      const response = await fetch("/api/ejercicios", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${session?.backendJWT}`
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el ejercicio");
      }

      const result = await response.json();
      setImageUrl(result.imageUrl);
      alert(`¡Ejercicio "${result.name}" creado con éxito!`);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Fallo al crear el ejercicio.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>
          Nombre del Ejercicio
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.formInput}
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.formLabel}>
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          className={styles.formTextarea}
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="muscleGroup" className={styles.formLabel}>
          Grupo Muscular
        </label>
        <select
          id="muscleGroup"
          name="muscleGroup"
          className={styles.formSelect}
          value={formData.muscleGroup}
          onChange={handleInputChange}
        >
          <option value="pecho">Pecho</option>
          <option value="espalda">Espalda</option>
          <option value="pierna">Pierna</option>
          <option value="brazo">Brazo</option>
          <option value="hombro">Hombro</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="ejercicio-imagen" className={styles.formLabel}>
          Imagen del Ejercicio
        </label>
        <input
          type="file"
          id="ejercicio-imagen"
          className={styles.formInput}
          onChange={handleFileChange}
          accept="image/*"
          required
        />
      </div>

      <button type="submit" className={styles.formButton} disabled={isLoading}>
        {isLoading ? "Creando..." : "Crear Ejercicio"}
      </button>
      
      {imageUrl && (
        <div className={styles.preview}>
          <h4>Imagen Subida:</h4>
          <Image src={imageUrl} alt="Ejercicio subido" width={200} height={200} />
        </div>
      )}
    </form>
  );
}
