"use client";

import React from "react";
import styles from "./plans.module.scss";
import { FaRegCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useActivePlans } from "@/hooks/useActivePlans";

const Plans = () => {
  const router = useRouter();
  const { plans: activePlans, loading: plansLoading } = useActivePlans();

  const handlePay = () => {
    router.push("/subscription");
  };

  return (
    <section className={styles.plansSection}>
      <div className={styles.mensaje}>
        <h2>Unete al equipo TrainUp</h2>
      </div>
      <div className={styles.contCard}>
        {plansLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando planes disponibles...</p>
          </div>
        ) : activePlans.length === 0 ? (
          <div className={styles.noPlans}>
            <p>No hay planes disponibles en este momento.</p>
          </div>
        ) : (
          activePlans.map((plan) => (
            <div key={plan.id} className={styles.planCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <button className={styles.goProButton}>GO PRO</button>
              </div>

              <div className={styles.planDescription}>
                <p>{plan.description}</p>
              </div>

              <div className={styles.priceSection}>
                <span className={styles.currentPrice}>${plan.price}/mes</span>
              </div>

              <div className={styles.planDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duración:</span>
                  <span className={styles.detailValue}>
                    {plan.durationDays} días
                  </span>
                </div>
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
          ))
        )}
      </div>
    </section>
  );
};

export default Plans;
