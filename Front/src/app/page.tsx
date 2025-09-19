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
      <Hero />
      <CardsHome />
      <GaleryHome />
      <Plans />
      <ComponentGoogleMaps />
      <ComponentContact />
      <ComentaryUser />
    </div>
  );
}
