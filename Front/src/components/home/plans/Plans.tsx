"use client";

import React from "react";
import styles from "./plans.module.scss";
import { FaRegCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Plans = () => {
  const router = useRouter();

  const handlePay = () => {
    router.push("/subscription");
  };

  return (
    <section className={styles.plansSection}>
      <div className={styles.mensaje}>
        <h2>Unete al equipo TrainUp</h2>
      </div>
      <div className={styles.contCard}>
        <div className={styles.planCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.planName}>Plan TrainUp Plus</h3>
            <button className={styles.goProButton}>GO PRO</button>
          </div>

          <div className={styles.welcomeMessage}>
            <p>
              Cada meta necesita un plan. <br /> Encuentra el tuyo y comienza tu
              transformación hoy mismo.
            </p>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.currentPrice}>$20/mes</span>
            <span className={styles.originalPrice}>$30/mes</span>
          </div>

          <ul className={styles.planBenefits}>
            <li>
              <FaRegCheckCircle /> Acceso ilimitado a todas las clases
            </li>
            <li>
              <FaRegCheckCircle /> Entrenadores certificados
            </li>
            <li>
              <FaRegCheckCircle /> Uso de todas las máquinas y equipos
            </li>
            <li>
              <FaRegCheckCircle /> Acceso a entrenamientos personalizados
            </li>
            <li>
              <FaRegCheckCircle /> Agendamiento de clases
            </li>
          </ul>

          <button className={styles.payButton} onClick={handlePay}>
            Disfrutar ahora
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plans;
