import { useEffect, useState } from "react";
import styles from "./SalesHistory.module.css";
import HousesList from "../houses/HousesList";


const SalesHistory = () => {
  const [soldHouses, setSoldHouses] = useState([]);

  useEffect(() => {
    document.title = "Sälj historik";
    const fetchHouses = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/house`);
        const data = await response.json();
        setSoldHouses(data);
      } catch {
        console.log("Något gick fel");
      }
    };

    fetchHouses();
  }, []);


  const soldHousesWithSalePrice = soldHouses.filter(house => house.sold !== null);
  return (
    <main className={styles.sold}>
      <div className={styles.splash}>
        <h1>SÅLDA HUS</h1>
        <p>Här finner du våra senaste sålda hus.</p>
      </div>
      <section>
        {soldHousesWithSalePrice.length > 0 ? <HousesList houses={soldHousesWithSalePrice} /> : <p>Inga sålda hus ännu!</p>}
      </section>
    </main>
  )
}

export default SalesHistory;