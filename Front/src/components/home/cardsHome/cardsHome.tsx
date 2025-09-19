"use client";
import Image from "next/image";
import styles from "./cardsHome.module.scss";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const CardsHome = () => {
  const { userData } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    router.push("/subscription");
  };

  return (
    <div className={styles.sectionClases}>
      <div className={styles.mensaje}>
        <h2>
          Conoce las mejores clases en{" "}
          <span className={styles.trainUp}>TrainUp</span>
        </h2>
      </div>

      <div className={styles.contCards}>
        {/* Card Zumba */}
        <div className={styles.cardClase}>
          <div className={styles.cardImage}>
            <Image
              src="/images/Zumba.png"
              alt="Zumba class"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              quality={95}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.badge}>ZUMBA</div>
            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.icon}>⏱️</span>
                <span>30/45/60 min</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.icon}>⚡</span>
                <span>Alta</span>
              </div>
            </div>
            <p className={styles.description}>
              Diviértete y combina el baile con una rutina de ejercicio al ritmo
              de la música, mejora tu condición y coordinación.
            </p>
          </div>
        </div>

        {/* Card HIIT */}
        <div className={styles.cardClase}>
          <div className={styles.cardImage}>
            <Image
              src="/images/poster6.jpg"
              alt="HIIT class"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.badge}>HIIT</div>
            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.icon}>⏱️</span>
                <span>45 min</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.icon}>⚡</span>
                <span>Alta</span>
              </div>
            </div>
            <p className={styles.description}>
              Circuitos de entrenamiento de alta intensidad que maximizan la
              quema de calorías y mejoran tu condición cardiovascular.
            </p>
          </div>
        </div>

        {/* Card Boxeo */}
        <div className={styles.cardClase}>
          <div className={styles.cardImage}>
            <Image
              src="/images/Boxeo.png"
              alt="Boxeo class"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.badge}>BOXEO</div>
            <div className={styles.details}>
              <div className={styles.detail}>
                <span className={styles.icon}>⏱️</span>
                <span>60/90 min</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.icon}>⚡</span>
                <span>Alta</span>
              </div>
            </div>
            <p className={styles.description}>
              Libera tu energía en un entrenamiento guiado que combina técnicas
              de artes marciales, música y ejercicio cardiovascular.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.contButton}>
        <button className={styles.buttonInscripcion} onClick={handleClick}>
          ¡Inscríbete ya!
        </button>
      </div>
    </div>
  );
};

export default CardsHome;
