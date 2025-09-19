"use client";

import { useState } from "react";
import styles from "./galeryHome.module.scss";
import Image from "next/image";

const galleriaImagenes = [
  { id: 1, src: "/images/poster10.jpg", alt: "Gym imagen 1" },
  { id: 2, src: "/images/poster5.jpg", alt: "Gym imagen 2" },
  { id: 3, src: "/images/poster6.jpg", alt: "Gym imagen 3" },
  { id: 4, src: "/images/poster7.jpg", alt: "Gym imagen 4" },
  { id: 5, src: "/images/poster8.jpg", alt: "Gym imagen 5" },
  { id: 6, src: "/images/poster9.jpg", alt: "Gym imagen 6" },
];

const GaleryHome = () => {
  const [selectImage, setSelectImage] = useState<string | null>(null);

  // Duplicar las imágenes múltiples veces para movimiento infinito suave
  const carouselImages = [
    ...galleriaImagenes,
    ...galleriaImagenes,
    ...galleriaImagenes,
  ];

  // Función para abrir imagen en modal (sin afectar el movimiento)
  const openImageModal = (imageSrc: string) => {
    setSelectImage(imageSrc);
  };

  return (
    <section className={styles.sectionGaleria}>
      <div className={styles.mensaje}>
        <h2>Galeria</h2>
      </div>

      <div className={styles.carouselContainer}>
        {/* Carrusel principal con movimiento infinito */}
        <div className={styles.carousel}>
          <div className={styles.carouselTrack}>
            {carouselImages.map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className={styles.contImages}
                onClick={() => openImageModal(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={95}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  style={{ objectFit: "cover", backgroundColor: "black" }}
                  priority={index < 3}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectImage && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectImage(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectImage}
              alt="Imagen seleccionada"
              width={900}
              height={800}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default GaleryHome;
