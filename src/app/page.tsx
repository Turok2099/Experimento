import styles from "../styles/home.module.scss";
import ComponentGoogleMaps from "@/components/home/googleMaps/googleMaps";
import ComponentContact from "@/components/home/contact/ComponentContact";
import GaleryHome from "@/components/home/galery/GaleryHome";
import ComentaryUser from "@/components/home/comentaryUser/ComentaryUser";
import CardsHome from "@/components/home/cardsHome/cardsHome";
import Hero from "@/components/home/hero/Hero";
import Plans from "@/components/home/plans/Plans";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className="home-section-hero">
        <Hero />
      </div>

      <div className="home-section">
        <div className={styles.sectionTitle}>
          <h2>Conoce nuestras clases</h2>
        </div>
        <CardsHome />
      </div>

      <div className="home-section">
        <div className={styles.sectionTitle}>
          <h2>Galería</h2>
        </div>
        <GaleryHome />
      </div>

      <div className="home-section">
        <div className={styles.sectionTitle}>
          <h2>Únete al equipo TrainUp</h2>
        </div>
        <Plans />
      </div>

      <div className="home-section">
        <div className={styles.sectionTitle}>
          <h2>Visítanos</h2>
        </div>
        <ComponentGoogleMaps />
      </div>

      <div className="home-section">
        <div className={styles.sectionTitle}>
          <h2>Contáctanos</h2>
        </div>
        <ComponentContact />
      </div>

      <div className="home-section">
        <div className={styles.sectionTitle}>
          <h2>Reseñas de nuestros usuarios</h2>
        </div>
        <ComentaryUser />
      </div>
    </div>
  );
}
