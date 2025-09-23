"use client";

import React from "react";
import { PlanDto } from "@/types";
import styles from "./PlanCard.module.scss";

interface PlanCardProps {
  plan: PlanDto;
  onSelect: (plan: PlanDto) => void;
  isSelected?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSelect,
  isSelected = false,
}) => {
  return (
    <div
      className={`${styles.planCard} ${isSelected ? styles.selected : ""}`}
      onClick={() => onSelect(plan)}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>${plan.price}/mes</span>
        </div>
      </div>

      <div className={styles.planDescription}>
        <p>{plan.description}</p>
      </div>

      <div className={styles.planDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Duración:</span>
          <span className={styles.detailValue}>{plan.durationDays} días</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Estado:</span>
          <span className={`${styles.detailValue} ${styles.activeStatus}`}>
            {plan.isActive ? "Disponible" : "No disponible"}
          </span>
        </div>
      </div>

      <div className={styles.planBenefits}>
        <div className={styles.benefitItem}>
          <span className={styles.checkIcon}>✓</span>
          <span>Acceso ilimitado a todas las clases</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.checkIcon}>✓</span>
          <span>Entrenadores certificados</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.checkIcon}>✓</span>
          <span>Uso de todas las máquinas y equipos</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.checkIcon}>✓</span>
          <span>Acceso a entrenamientos personalizados</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.checkIcon}>✓</span>
          <span>Agendamiento de clases</span>
        </div>
      </div>

      <button className={styles.selectButton} disabled={!plan.isActive}>
        {plan.isActive ? "Seleccionar Plan" : "No Disponible"}
      </button>
    </div>
  );
};

export default PlanCard;

