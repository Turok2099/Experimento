"use client";

import React, { useState } from "react";
import styles from "./PlansManagement.module.scss";
import { PlanDto, useGetPlans } from "@/hooks/superadmin/plans/useGetPlans";
import { useCreatePlan } from "@/hooks/superadmin/plans/useCreatePlan";
import { useUpdatePlan } from "@/hooks/superadmin/plans/useUpdatePlan";
import { useDeletePlan } from "@/hooks/superadmin/plans/useDeletePlan";
import { useTogglePlanStatus } from "@/hooks/superadmin/plans/useTogglePlanStatus";


interface PlansManagementProps {
  token: string;
}

const PlansManagement: React.FC<PlansManagementProps> = ({ token }) => {
  const { plans, loading, fetchPlans } = useGetPlans(token);
  const { createPlan } = useCreatePlan(token);
  const { updatePlan } = useUpdatePlan(token);
  const { deletePlan } = useDeletePlan(token);
  const { togglePlanStatus } = useTogglePlanStatus(token);

  const [editingPlan, setEditingPlan] = useState<PlanDto | null>(null);
  const [formData, setFormData] = useState<Partial<PlanDto>>({});

  // Crear nuevo plan
  const handleCreate = async () => {
    await createPlan(formData);
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

  // Eliminar
  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este plan?")) return;
    await deletePlan(id);
    fetchPlans();
  };

  // Activar/Desactivar
  const handleToggle = async (id: string, status: "active" | "inactive") => {
    const newStatus = status === "active" ? "inactive" : "active";
    await togglePlanStatus(id, newStatus);
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          value={formData.duration || ""}
          onChange={(e) =>
            setFormData({ ...formData, duration: parseInt(e.target.value) })
          }
        />

        <button onClick={editingPlan ? handleUpdate : handleCreate}>
          {editingPlan ? "Guardar cambios" : "Crear"}
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
                <td>{plan.name}</td>
                <td>{plan.description}</td>
                <td>${plan.price}</td>
                <td>{plan.duration} días</td>
                <td>{plan.status}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setFormData(plan);
                    }}
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(plan.id)}>Eliminar</button>
                  <button onClick={() => handleToggle(plan.id, plan.status)}>
                    {plan.status === "active" ? "Desactivar" : "Activar"}
                  </button>
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
