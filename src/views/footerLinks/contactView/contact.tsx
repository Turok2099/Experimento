"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "./contact.module.scss";

const ContactView = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        "default_service",
        "template_5rlr22d",
        form.current,
        "GakbZspcfg7mE_l9R"
      )
      .then(() => {
        alert("¡Mensaje enviado con éxito! 🚀");
        setLoading(false);
        form.current?.reset();
      })
      .catch((err) => {
        alert("Error al enviar: " + JSON.stringify(err));
        setLoading(false);
      });
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contáctanos</h1>
      </div>

      <div className={styles.mainContent}>
        {/* Panel izquierdo - Información de contacto */}
        <div className={styles.contactInfo}>
          <div className={styles.infoContent}>
            <h2 className={styles.infoTitle}>
              ¡Dinos algo para iniciar una conversación!
            </h2>
            <p className={styles.infoSubtitle}></p>

            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <span className={styles.icon}>📞</span>
                <span>+57 300 123 4567</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.icon}>✉️</span>
                <span>info@trainup.com</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.icon}>📍</span>
                <span>Carrera 15 #93-47, Bogotá, Colombia</span>
              </div>
            </div>
          </div>
          <div className={styles.decorativeCircles}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className={styles.formContainer}>
          <form ref={form} className={styles.form} onSubmit={sendEmail}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre</label>
                <input
                  className={styles.input}
                  type="text"
                  name="from_name"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Apellido</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                name="email_id"
                placeholder="tu.email@email.com"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Número de Teléfono</label>
              <input
                className={styles.input}
                type="tel"
                placeholder="tu numero telefonico"
              />
            </div>

            <div className={styles.subjectSection}>
              <label className={styles.subjectLabel}>
                ¿Selecciona el asunto?
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="subject"
                    value="consulta"
                    defaultChecked
                  />
                  <span>Consulta General</span>
                </label>
                <label className={styles.radioOption}>
                  <input type="radio" name="subject" value="membresia" />
                  <span>Membresía</span>
                </label>
                <label className={styles.radioOption}>
                  <input type="radio" name="subject" value="clases" />
                  <span>Clases</span>
                </label>
                <label className={styles.radioOption}>
                  <input type="radio" name="subject" value="soporte" />
                  <span>Soporte</span>
                </label>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mensaje</label>
              <textarea
                className={styles.textarea}
                name="message"
                placeholder="Escribe tu mensaje..."
                required
                rows={4}
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
