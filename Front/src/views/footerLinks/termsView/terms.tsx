import styles from "./terms.module.scss";

export const TermsView = () => {
  return (
    <section className={styles.termsView}>
      <div className={styles.termsContent}>
        <div className={styles.termsTitle} >
          <h2 >Términos y Condiciones</h2>
        </div>
        <p className={styles.termsDescription}>
          Bienvenido a TrainUp. Al utilizar nuestra plataforma, aceptas los
          siguientes términos y condiciones. Por favor, léelos cuidadosamente.
        </p>

        <ul className={styles.termsList}>
          <li>
            <strong>Uso Responsable:</strong> El usuario se compromete a
            utilizar los servicios de manera ética y respetuosa, evitando
            cualquier conducta que pueda afectar a otros miembros o al
            funcionamiento de la plataforma.
          </li>
          <li>
            <strong>Condición Física:</strong> Antes de iniciar cualquier
            rutina, el usuario debe asegurarse de estar en condiciones físicas
            adecuadas. TrainUp no se responsabiliza por lesiones derivadas del
            mal uso de los programas.
          </li>
          <li>
            <strong>Privacidad de Datos:</strong> La información personal
            proporcionada será tratada conforme a nuestra política de
            privacidad. No compartimos datos con terceros sin consentimiento.
          </li>
          <li>
            <strong>Propiedad Intelectual:</strong> Todos los contenidos,
            rutinas, imágenes y materiales disponibles en la plataforma son
            propiedad de TrainUp y no pueden ser reproducidos sin autorización.
          </li>
          <li>
            <strong>Modificaciones:</strong> TrainUp se reserva el derecho de
            modificar estos términos en cualquier momento. Las actualizaciones
            serán comunicadas a través de la plataforma.
          </li>
        </ul>

        <p className={styles.termsFooter}>
          Al continuar utilizando TrainUp, confirmas que has leído y aceptado
          estos términos. Para cualquier duda, contáctanos a través de nuestro
          formulario de soporte.
        </p>
      </div>
    </section>
  );
};
