import { useEffect } from "react";
import Houses from "../houses/Houses";
import News from "../news/News";
import arrowIcon from "../../assets/icons/arrow-down-circle-svgrepo-com.svg";

import styles from "./Home.module.css";

const Home = () => {
  useEffect(() => {
    document.title = "Hem";
  }, []);

  // Scroll to #news smooth
  const scroll = () => {
    const element = document.getElementById("news-anchor");
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className={styles.main}>
      <div className={styles.splash}>
        <h1>HITTA DITT DRÖMHUS</h1>
        <p>På grupp 3's mäklarsida hjälper vi dig!</p>
        <img src={arrowIcon} alt="Arrow" width="60" height="60" onClick={scroll} />
      </div>
      <div className={styles.divider}></div>
      <News />
      <div className={styles.divider}></div>
      <Houses />
    </main>
  );
};

export default Home;
