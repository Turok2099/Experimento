"use client";

import React, { useState } from "react";
import styles from "./googleMaps.module.scss";

const ComponentGoogleMaps: React.FC = () => {
  const [loadedMaps, setLoadedMaps] = useState<Set<number>>(new Set());

  const handleMapLoad = (index: number) => {
    setLoadedMaps((prev) => new Set(prev).add(index));
  };

  const locations = [
    {
      country: "ARGENTINA",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d420554.98831999546!2d-58.858247284931004!3d-34.564040070044804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5383bf0c9db%3A0x182d1118a56207a3!2sSmart%20Fit%20Imprenta!5e0!3m2!1ses-419!2smx!4v1757698744114!5m2!1ses-419!2smx",
    },
    {
      country: "COLOMBIA",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63631.03625358543!2d-74.14650321006775!3d4.604807920797024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f999e2c0db83b%3A0x25fb491c4055efc1!2sGimnasio%20Smart%20Fit%20-%20Bacat%C3%A1!5e0!3m2!1ses-419!2smx!4v1757698536823!5m2!1ses-419!2smx",
    },
    {
      country: "MÉXICO",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60199.88042391366!2d-99.22766804695128!3d19.434320473203304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f9f80925eb27%3A0x15f2a79191b610ba!2sGimnasio%20Smart%20Fit%20-%20Reforma%2026!5e0!3m2!1ses-419!2smx!4v1757698801811!5m2!1ses-419!2smx",
    },
  ];

  return (
    <section className={styles.container}>
      <div className={styles.mapsRow}>
        {locations.map((loc, index) => (
          <div key={index} className={styles.wrapper}>
            <div className={styles.mapContainer}>
              {!loadedMaps.has(index) && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}></div>
                  <p>Cargando mapa...</p>
                </div>
              )}
              <iframe
                src={loc.src}
                style={{
                  border: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  opacity: loadedMaps.has(index) ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${loc.country}`}
                aria-label={`Ubicación del gimnasio en ${loc.country}`}
                onLoad={() => handleMapLoad(index)}
              ></iframe>
            </div>
            <p className={styles.countryLabel}>{loc.country}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComponentGoogleMaps;
