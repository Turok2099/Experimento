// src/components/home/comentaryUser/ComentaryUser.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./comentaryUser.module.scss";
import { FaStar } from "react-icons/fa";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { AllCommentService } from "@/services/AllCommentService";
import type { Comentary } from "@/types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function ComentaryUser() {
    const [items, setItems] = useState<Comentary[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
        try {
            const data = await AllCommentService.getAllComments();
            setItems(data);
        } catch (e: any) {
            setErr(e?.message || "No se pudieron cargar las reseñas");
        } finally {
            setLoading(false);
        }
        })();
    }, []);

    const settings = useMemo(
        () => ({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(3, Math.max(1, items.length || 1)),
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: Math.min(2, Math.max(1, items.length || 1)) } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
        }),
        [items.length]
    );

    if (loading) return <section className={styles.sectionComentary}><p className={styles.muted}>Cargando reseÃ±asâ€¦</p></section>;
    if (err) return <section className={styles.sectionComentary}><p className={styles.alert}>{err}</p></section>;
    if (!items.length) return <section className={styles.sectionComentary}><p className={styles.muted}>AÃºn no hay reseÃ±as.</p></section>;

    return (
        <section className={styles.sectionComentary}>
        <div className={styles.mensaje}><h2>Comentarios de usuarios</h2></div>
        <div className={styles.sliderWrapper}>
            <Slider {...settings}>
            {items.map((c) => (
                <div key={c.id} className={styles.card}>
                <span className={styles.userName}>{c.user?.name ?? "Anonimo"}</span>
                <p className={styles.text}>
                    <ImQuotesLeft size={18} style={{ color: "var(--colorAmarillo)", marginRight: ".5rem" }} />
                    {c.text || "Sin comentario"}
                    <ImQuotesRight size={18} style={{ color: "var(--colorAmarillo)", marginLeft: ".5rem" }} />
                </p>
                <div className={styles.footer}>
                    <span className={styles.date}>{c.date}</span>
                    <div className={styles.stars}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <FaStar key={i} className={i < c.rating ? styles.starActive : styles.star} />
                    ))}
                    </div>
                </div>
                </div>
            ))}
            </Slider>
        </div>
    </section>
    );
}