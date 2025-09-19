// src/components/userDashboard/comments/Comments.tsx
"use client";

import type React from "react";
import { useState } from "react";
import type { Comentary } from "@/types";
import styles from "./comments.module.scss";

// Tipo mínimo que este componente necesita del usuario
type CommentsUser = { id: string | number; name: string };

interface CommentsProps {
    user: CommentsUser;
    comments: Comentary[];
    onAddComment: (comment: Omit<Comentary, "id">) => void;
}

export default function Comments({ user, comments, onAddComment }: CommentsProps) {
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");

    // normalizamos IDs a string para evitar mismatch string/number
    const userIdStr = String(user.id);
    const userComments = comments.filter((c) => String(c.userId) === userIdStr);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        onAddComment({
        userId: user.id,
        text: newComment.trim(),
        date: new Date().toISOString().split("T")[0],
        rating,
        user: { id: user.id, name: user.name },
        });

        setNewComment("");
        setRating(5);
        setMessage("Comentario agregado correctamente");
        setTimeout(() => setMessage(""), 3000);
    };

    const renderStars = (value: number) => (
        <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= value ? styles.star : styles.emptyStar}>
            ★
            </span>
        ))}
        </div>
    );

    return (
        <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Comentarios realizados</h2>

        {message && <div className={styles.alert}>{message}</div>}

        <div className={styles.sectionAddyTabla}>
            {/* Formulario */}
            <div className={styles.commentForm}>
            <h3>Agregar Comentario</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                <label>Comentario</label>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario sobre el gimnasio..."
                    required
                />
                </div>

                <div className={styles.formGroup}>
                <label>Calificación</label>
                <select
                    className={styles.select}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                >
                    <option value={5}>5 estrellas - Excelente</option>
                    <option value={4}>4 estrellas - Muy bueno</option>
                    <option value={3}>3 estrellas - Bueno</option>
                    <option value={2}>2 estrellas - Regular</option>
                    <option value={1}>1 estrella - Malo</option>
                </select>
                </div>

                <button type="submit" className={styles.submitButton}>
                Agregar Comentario
                </button>
            </form>
            </div>

            {/* Tabla */}
            <div className={styles.contComentarios}>
            <h3>Mis Comentarios</h3>

            {userComments.length === 0 ? (
                <p className={styles.emptyMessage}>No has hecho comentarios aún.</p>
            ) : (
                <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Usuario</th>
                    <th>Comentario</th>
                    <th>Calificación</th>
                    <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {userComments.map((comment) => {
                    const isMine = String(comment.userId) === userIdStr;
                    const author = isMine ? "Tú" : comment.user?.name ?? "Anónimo";
                    return (
                        <tr key={comment.id}>
                        <td>{author}</td>
                        <td>{comment.text}</td>
                        <td>{renderStars(comment.rating)}</td>
                        <td>{comment.date}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            )}
            </div>
        </div>
    </div>
    );
}
