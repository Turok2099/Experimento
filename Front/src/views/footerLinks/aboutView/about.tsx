import styles from "./about.module.scss";

export const AboutView = () => {
  return (
    <section className={styles.aboutView}>
      <div className={styles.aboutContent}>
        <div  className={styles.aboutTitle}>
          <h2>Sobre Nosotros</h2>
        </div>
        <p className={styles.aboutDescription}>
          En <strong>TrainUp</strong> combinamos nuestra pasión por el fitness y
          la tecnología para ofrecerte una experiencia de entrenamiento única.
          Nuestro objetivo es ayudarte a alcanzar tu máximo potencial físico y
          mental, sin importar tu nivel de experiencia.
        </p>

        <h3 className={styles.aboutSubtitle}>Nuestra Misión</h3>
        <p className={styles.aboutDescription}>
          Brindar herramientas innovadoras, rutinas personalizadas y asesoría
          integral en nutrición y entrenamiento, respaldadas por una comunidad
          activa que te motive a mantenerte constante.
        </p>

        <h3 className={styles.aboutSubtitle}>Nuestros Valores</h3>
        <ul className={styles.aboutList}>
          <li>
            <strong>Compromiso:</strong> Estamos contigo en cada paso de tu
            camino hacia una vida más saludable.
          </li>
          <li>
            <strong>Innovación:</strong> Usamos tecnología de vanguardia para
            optimizar tu experiencia de entrenamiento.
          </li>
          <li>
            <strong>Accesibilidad:</strong> Diseñamos herramientas intuitivas
            para que cualquier persona pueda usarlas.
          </li>
          <li>
            <strong>Comunidad:</strong> Creemos en el poder de entrenar y crecer
            juntos.
          </li>
        </ul>

        <h3 className={styles.aboutSubtitle}>Por qué elegirnos</h3>
        <p className={styles.aboutDescription}>
          A diferencia de otras plataformas, en TrainUp no solo te damos un
          plan: te acompañamos con seguimiento en tiempo real, métricas de
          progreso y adaptaciones constantes para que siempre avances hacia tus
          metas.
        </p>
      </div>
    </section>
  );
};
