import React from 'react';
import CrearEjercicioForm from '@/components/admin/CreateEjercice';
import styles from '@/components/admin/CreateEjercice.module.scss'; 

export default function CrearEjercicioPage() {
  return (
    <div className={styles.mainContent}> 
      <div className={styles.pageHeader}>
        <h2>Crear Nuevo Ejercicio</h2>
      </div>
      <p className={styles.pageDescription}>
        Completa los siguientes campos para añadir un nuevo ejercicio a la base de datos.
      </p>

      <CrearEjercicioForm /> 
    </div>
  );
}