'use client';

import React from "react";
import { useAuth } from "@/context/AuthContext";
import "./trainerPanelView.module.scss";

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
        <h2>Welcome, {name}</h2>
        <p>
          <span>Email:</span> {email}
        </p>
        <p>
          <span>Address:</span> {address || "No address provided"}
        </p>
      </div>
    </div>
  );
};

export default TrainerPanelView;
