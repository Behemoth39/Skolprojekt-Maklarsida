import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Houses.module.css";

import { DeleteBtn, EditBtn } from "../../components/buttons/Buttons";
import { UserContext } from "../../contexts/userContext";

const HouseItem = ({ house }) => {
  const { isLoggedIn, username } = useContext(UserContext);
  const location = useLocation();

  function formatPrice(price) {
    return new Intl.NumberFormat('sv-SE').format(price);
  }

  function percentChange(oldPrice, newPrice) {
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }

  return (
    <>
      <section className={styles.info}>
        {isLoggedIn && location.pathname !== "/" && location.pathname !== "/sales" ? (<>
          <h3 className={styles["info-creator"]} >Ansvarig mäklare: <b>{house.user[0].toUpperCase()}{house.user.slice(1)}</b></h3>
        </>) : null}

        <div className={styles.mainimg} style={{ backgroundImage: `url(${house.pictures[1].pictureUrl})` }}></div>
        <p className={styles["info-address"]}>{house.region}</p>
        <h2>{house.address}</h2>

        {location.pathname === '/sales' && (
          <div className={styles.historyPrice}>
            <p>Listad för: {formatPrice(house.price)} {house.currency}</p>
            <p>Såld för: <b className={house.sold > house.price ? styles.soldPricePostive : styles.soldPriceNegative}>{formatPrice(house.sold)} {house.currency}</b></p>
            <p>Differens: <b className={house.sold > house.price ? styles.soldPricePostive : styles.soldPriceNegative}>{percentChange(house.price, house.sold).toFixed(2)}%</b></p>
          </div>
        )}

        {location.pathname === '/sales' ? (null) : <p className={styles.infominor}>{house.type} &nbsp;|&nbsp; {house.size} KVM </p>}
        {location.pathname === '/sales' ? (null) : <p className={styles.infominor2}>{house.rooms} RUM &nbsp;|&nbsp; {formatPrice(house.price)} kr</p>}
      </section>

      {isLoggedIn && username === house.user && location.pathname === "/admin" ? (
        <section className={styles["btn-group"]}>
          <DeleteBtn data={house.id} type='house' />
          <Link to={`/houses/edit/${house.id}`}>
            <EditBtn data={"Redigera hus"}></EditBtn>
          </Link>
        </section>
      ) : (
        <div className={styles["container-gap"]}></div>
      )}
    </>
  );
};

export default HouseItem;
