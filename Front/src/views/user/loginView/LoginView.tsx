import LoginForm from "@/components/authentication/loginForm/LoginForm";
import styles from "./loginView.module.scss";

const LoginView = () => {
  return (
    <>
      <div className={styles.contLoginView}>
        <div className={styles.mainContent}>
          {/* Panel izquierdo - Card de bienvenida */}
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>¡Bienvenido de nuevo!</h2>
              <p className={styles.welcomeSubtitle}>
                Nos alegra verte entrenando otra vez.
              </p>
              <p className={styles.welcomeText}>
                Continúa tu camino hacia un cuerpo más fuerte y una mente más
                sana.
              </p>
            </div>
            <div className={styles.decorativeCircles}>
              <div className={styles.circle1}></div>
              <div className={styles.circle2}></div>
            </div>
          </div>

          {/* Panel derecho - Formulario */}
          <div className={styles.formSection}>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginView;
