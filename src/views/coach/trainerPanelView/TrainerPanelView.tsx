'use client';

import React from "react";
import { useAuth } from "@/context/AuthContext";
import "./trainerPanelView.scss";

const TrainerPanelView: React.FC = () => {
  const { userData } = useAuth();

  if (!userData?.user) {
    return (
      <div className="trainer-wrapper">
        <div className="trainer-card loading-card">
          <p>Cargando datos del entrenador...</p>
        </div>
      </div>
    );
  }

  const { name, email, address } = userData.user;

  return (
    <div className="trainer-wrapper">
      <div className="trainer-card">
        <h2 className="bold-black">Bienvenido, {name}</h2>
        <p>
          <span className="sub">EMAIL:</span> {email}
        </p>
        <p>
          <span className="sub">DIRECCION:</span> {address || "No address provided"}
        </p>
        <p>
          <span className="sub">ROL:</span> {userData.user.role}
        </p>
      </div>
    </div>
  );
};

export default TrainerPanelView;
