"use client";

import React, { useEffect, useState, memo } from "react";
import styles from "./ReviewsManagement.module.scss";
import {
  AllCommentsService,
  Review,
} from "@/hooks/superadmin/reviews/AllCommentsService";

interface ReviewsManagementProps {
  token?: string;
}

const ReviewsManagement: React.FC<ReviewsManagementProps> = ({ token }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReviews = async () => {
    console.log(
      "🔄 Iniciando fetchReviews con token:",
      token ? "✅ Presente" : "❌ Ausente"
    );

    if (!token) {
      console.log("❌ No hay token, cancelando fetchReviews");
      return;
    }

    try {
      setLoading(true);
      console.log("⏳ Cargando reviews...");
      const data = await AllCommentsService.getAllComments(token);
      console.log("📋 Reviews obtenidas:", data);
      setReviews(data);
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
    } finally {
      setLoading(false);
      console.log("✅ Loading terminado");
    }
  };

  useEffect(() => {
    console.log(
      "🎯 useEffect ejecutado, token:",
      token ? "✅ Presente" : "❌ Ausente"
    );
    if (token) fetchReviews();
  }, [token]);

  // Aprobar o rechazar reseña
  const handleModerateReview = async (
    id: number,
    action: "approve" | "reject"
  ) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/moderate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ action }),
      });
      fetchReviews();
    } catch (error) {
      console.error("❌ Error moderating review:", error);
    }
  };

  // Activar o desactivar reseña
  const handleToggleStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchReviews();
    } catch (error) {
      console.error("❌ Error updating review status:", error);
    }
  };

  if (loading) return <p>Cargando reseñas...</p>;

  if (reviews.length === 0) {
    return <p className={styles.empty}>⚠️ No hay reseñas para mostrar</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gestión de Reseñas</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Reseña</th>
              <th>Rating</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.user?.name ?? "Anónimo"}</td>
                <td>{review.text}</td>
                <td>{"⭐".repeat(review.rating)}</td>
                <td>{review.status}</td>
                <td>
                  <button
                    className={styles.approveBtn}
                    onClick={() => handleModerateReview(review.id, "approve")}
                  >
                    Aprobar
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleModerateReview(review.id, "reject")}
                  >
                    Rechazar
                  </button>
                  <button
                    className={styles.toggleBtn}
                    onClick={() =>
                      handleToggleStatus(
                        review.id,
                        review.status === "active" ? "inactive" : "active"
                      )
                    }
                  >
                    {review.status === "active" ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ReviewsManagement);
