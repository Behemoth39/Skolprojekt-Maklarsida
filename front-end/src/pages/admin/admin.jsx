import { useContext, useEffect, useState } from "react";
import styles from "./admin.module.css";
import Houses from "../houses/Houses";
import News from "../news/News";
import { CreateUser } from "../../components/createUser/CreateUser";
import { UserContext } from "../../contexts/userContext";
import { CreateBtn } from "../../components/buttons/Buttons";
import { Link } from "react-router-dom";

export const Admin = () => {
  const { isLoggedIn, isAdmin } = useContext(UserContext);
  const [showHouses, setShowHouses] = useState(true);

  useEffect(() => {
    document.title = "Admin";
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);


  const viewHouses = () => {
    if (showHouses) return;
    setShowHouses(true);
    document.querySelector(`.${styles.container}>button:nth-child(2)`).classList.remove(styles.active);
    document.querySelector(`.${styles.container}>button:nth-child(1)`).classList.add(styles.active);
  };

  const viewNews = () => {
    if (!showHouses) return;
    setShowHouses(false);
    document.querySelector(`.${styles.container}>button:nth-child(1)`).classList.remove(styles.active);
    document.querySelector(`.${styles.container}>button:nth-child(2)`).classList.add(styles.active);
  };

  return (
    <main className={styles.admin}>
      {isAdmin && <CreateUser />}
      <h1>ADMIN</h1>
      <section className={styles.container}>
        <button className={styles.active} onClick={viewHouses}>Hus</button>
        <button onClick={viewNews}>Nyheter</button>
        {showHouses ? (
          <>
            {isAdmin && (
              <Link to='/houses/create'>
                <CreateBtn data={"Skapa nytt hus"} />
              </Link>
            )}
            <Houses />
          </>
        ) : (
          <>
            {isAdmin && (
              <Link to='/news/create'>
                <CreateBtn data={"Skapa ny nyhet"} />
              </Link>
            )}
            <News />
          </>
        )}
      </section>
    </main>
  );
};
