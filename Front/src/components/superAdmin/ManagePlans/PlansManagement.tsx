"use client";

import React, { useState } from "react";
import styles from "./PlansManagement.module.scss";
import { useGetPlans } from "@/hooks/superadmin/plans/useGetPlans";
import { useCreatePlan } from "@/hooks/superadmin/plans/useCreatePlan";
import { useUpdatePlan } from "@/hooks/superadmin/plans/useUpdatePlan";
import { useTogglePlanStatus } from "@/hooks/superadmin/plans/useTogglePlanStatus";
import { useAuth } from "@/context/AuthContext";
import { Pencil } from "lucide-react";

interface PlanDto {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isActive: boolean;
  status: "active" | "inactive";
}

interface PlansManagementProps {
  token: string;
}

const PlansManagement: React.FC<PlansManagementProps> = () => {
  const { userData } = useAuth();
  const token = userData?.token as string | undefined;

  const { plans, loading, fetchPlans } = useGetPlans();
  const { createPlan } = useCreatePlan(token);
  const { updatePlan } = useUpdatePlan(token);
  const { togglePlanStatus } = useTogglePlanStatus();

  const [editingPlan, setEditingPlan] = useState<PlanDto | null>(null);
  const [formData, setFormData] = useState<Partial<PlanDto>>({});

  // Crear nuevo plan
  const handleCreate = async () => {
    if (!formData.name || !formData.price || !formData.durationDays) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }
    await createPlan(formData as any);
    setFormData({});
    fetchPlans();
  };

  // Guardar edición
  const handleUpdate = async () => {
    if (!editingPlan) return;
    await updatePlan(editingPlan.id, formData);
    setEditingPlan(null);
    setFormData({});
    fetchPlans();
  };

  // Activar/Desactivar
  const handleToggle = async (id: string, currentIsActive: boolean) => {
    await togglePlanStatus(id, currentIsActive);
    fetchPlans();
  };

  if (loading) return <p>Cargando planes...</p>;

  return (
    <div className={styles.container}>
      <h2>Gestión de Planes</h2>

      {/* Formulario Crear */}
      <div className={styles.form}>
        <h3>{editingPlan ? "Editar Plan" : "Nuevo Plan"}</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Precio"
          value={formData.price || ""}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Duración (días)"
          value={formData.durationDays || ""}
          onChange={(e) =>
            setFormData({ ...formData, durationDays: parseInt(e.target.value) })
          }
        />

        <button onClick={editingPlan ? handleUpdate : handleCreate}>
          {editingPlan ? "Actualizar" : "Crear"}
        </button>
        {editingPlan && (
          <button onClick={() => setEditingPlan(null)}>Cancelar</button>
        )}
      </div>

      {/* Tabla de planes */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plans.length === 0 ? (
            <tr>
              <td colSpan={6}>No hay planes registrados.</td>
            </tr>
          ) : (
            plans.map((plan) => (
              <tr key={plan.id}>
                <td>
                  {plan.name}
                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setFormData(plan); //precarga en el formulario
                    }}
                    className={styles.iconButton}
                  >
                    <Pencil size={16} />
                  </button>
                </td>
                <td>{plan.description}</td>
                <td>${plan.price}</td>
                {/* NO ME ESTA MOSTRANDO EL NUMERO DE DIAS */}
                <td>{plan.durationDays} días</td>
                <td>{plan.isActive ? "Activo" : "Inactivo"}</td>
                <td>
                  <div className={styles.contbuttons}>
                    {/* <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setFormData(plan);
                      }}
                    >
                      Editar
                    </button> */}
                    <button
                      onClick={() => handleToggle(plan.id, plan.isActive)}
                    >
                      {plan.isActive ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlansManagement;
