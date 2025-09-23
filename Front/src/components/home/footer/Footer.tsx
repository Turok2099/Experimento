import React from "react";
import styles from "./footer.module.scss";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} TrainUp. Todos los derechos reservados.
      </p>
      <div className={styles.links}>
        <Link href="/about">Sobre nosotros</Link>
        <Link href="/contact">Contacto</Link>
        <Link href="/terms">Términos y Condiciones</Link>
      </div>
    </footer>
  );
};

export default Footer;
