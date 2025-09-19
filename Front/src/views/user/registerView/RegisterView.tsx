// RegisterView
import RegisterForm from "@/components/authentication/registerForm/RegisterForm";
import React from "react";
import styles from "./registerView.module.scss";

const RegisterView = () => {
  return (
    <>
      <div className={styles.contRegisterView}>
        <div className={styles.mainContent}>
          {/* Panel izquierdo - Card de bienvenida */}
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>¡Bienvenido a TrainUp!</h2>
              <p className={styles.welcomeSubtitle}>
                Empieza hoy tu camino hacia un cuerpo más fuerte y una mente más
                sana.
              </p>
              <p className={styles.welcomeText}>
                ¡Regístrate gratis y únete a nuestra comunidad de fitness!
              </p>
            </div>
            <div className={styles.decorativeCircles}>
              <div className={styles.circle1}></div>
              <div className={styles.circle2}></div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className={styles.formSection}>
            <RegisterForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
