"use client";

import { useState } from "react";
import styles from "./galeryHome.module.scss";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

const galleriaImagenes = [
  { id: 1, src: "/images/poster1.jpg", alt: "Gym imagen 1" },
  { id: 2, src: "/images/poster2.jpg", alt: "Gym imagen 2" },
  { id: 3, src: "/images/poster3.jpg", alt: "Gym imagen 3" },
  { id: 4, src: "/images/poster4.jpg", alt: "Gym imagen 4" },
  { id: 5, src: "/images/poster5.jpg", alt: "Gym imagen 5" },
  { id: 6, src: "/images/poster6.jpg", alt: "Gym imagen 6" },
  { id: 7, src: "/images/poster7.jpg", alt: "Gym imagen 7" },
  { id: 8, src: "/images/poster8.jpg", alt: "Gym imagen 8" },
  { id: 9, src: "/images/poster9.jpg", alt: "Gym imagen 9" },
  { id: 10, src: "/images/poster10.jpg", alt: "Gym imagen 10" },
  { id: 11, src: "/images/poster11.jpg", alt: "Gym imagen 11" },
  { id: 12, src: "/images/poster12.jpg", alt: "Gym imagen 12" },
  { id: 13, src: "/images/poster13.jpg", alt: "Gym imagen 13" },
  { id: 14, src: "/images/poster14.jpg", alt: "Gym imagen 14" },
];

const GaleryHome = () => {
  const [selectImage, setSelectImage] = useState<string | null>(null);

  // Función para abrir imagen en modal
  const openImageModal = (imageSrc: string) => {
    setSelectImage(imageSrc);
  };

  return (
    <section className={styles.sectionGaleria}>
      <div className={styles.mensaje}>
        <h2>Galeria</h2>
      </div>

      <div className={styles.carouselContainer}>
        <Swiper
          modules={[FreeMode]}
          spaceBetween={20}
          slidesPerView="auto"
          freeMode={true}
          loop={true}
          autoplay={false}
          speed={0}
          allowTouchMove={true}
          className={styles.swiper}
        >
          {galleriaImagenes.map((image) => (
            <SwiperSlide key={image.id} className={styles.swiperSlide}>
              <div
                className={styles.contImages}
                onClick={() => openImageModal(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  style={{ objectFit: "cover" }}
                  priority={image.id <= 3}
                  loading={image.id <= 3 ? "eager" : "lazy"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      {selectImage && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectImage(null)}
              aria-label="Cerrar imagen"
            >
              ×
            </button>
            <Image
              src={selectImage}
              alt="Imagen seleccionada"
              width={900}
              height={800}
              quality={75}
              priority
              style={{ objectFit: "contain", cursor: "pointer" }}
              onClick={() => setSelectImage(null)}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default GaleryHome;
