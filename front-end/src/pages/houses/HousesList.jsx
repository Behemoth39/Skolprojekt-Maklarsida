import { useState } from "react";
import { useLocation } from "react-router-dom";
import HouseItem from "./HouseItem";
import styles from "./Houses.module.css";
import Modal from "../../components/modal/Modal";

const HousesList = ({ houses }) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [modalHouseData, setModalHouseData] = useState(null);

  const handleOpenModal = (house) => {
    if (location.pathname === "/admin") return;
    setModalHouseData(house);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const openRandomStreetInSweden = () => {
    // Define the bounds of Sweden
    const swedenBounds = {
      north: 62.06,
      south: 56.00,
      east: 17.50,
      west: 11.70
    };

    // Generate a random latitude and longitude within the bounds
    const randomLat = Math.random() * (swedenBounds.north - swedenBounds.south) + swedenBounds.south;
    const randomLng = Math.random() * (swedenBounds.east - swedenBounds.west) + swedenBounds.west;

    // Create a Google Maps URL with the random coordinates
    const mapsURL = `https://www.google.com/maps?q=${randomLat},${randomLng}`;

    // Open the URL in a new tab or window
    window.open(mapsURL);
  }

  // function that returns with thousand separator
  function formatPrice(price) {
    return new Intl.NumberFormat('sv-SE').format(price);
  }


  return (
    <>
      <section className={styles["house-card-container"]}>
        {houses.map((house) => (
          <div className={`${styles["house-card"]} ${location.pathname !== "/admin" ? styles["house-card-hover"] : ""}`} data-house-id={house.id} key={house.id} onClick={() => handleOpenModal(house)}>
            <HouseItem house={house} />
          </div>
        ))}
      </section >
      {showModal && (
        <Modal onClose={handleCloseModal} >
          <div className={styles['house-modal-img']} style={{ backgroundImage: `url(${modalHouseData.pictures[0].pictureUrl})` }} />
          <div className={styles['house-modal-twocols']}>
            <div>
              <h2 className={styles['house-modal-street']}>{modalHouseData.address}</h2>
              <p className={styles['house-modal-region']}>{modalHouseData.region}</p>
              <button className={styles['house-modal-maplink']} onClick={openRandomStreetInSweden}>Se på karta</button>
            </div>
            <div>
              <p className={styles['house-modal-price']}>{formatPrice(modalHouseData.price)} {modalHouseData.currency}</p>
            </div>
          </div>
          <hr className={styles['house-modal-hr']} />
          <div className={styles['house-modal-twocols-bottom']}>
            <div className={styles['house-modal-twocols-botleft']}>
              <p className={styles['house-modal-twocols-botleft-title']}>{modalHouseData.title}</p>
              <p>{modalHouseData.description}</p>
            </div>
            <div className={styles['house-modal-twocols-botright']}>
              <p>Bostadstyp</p>
              <b>{modalHouseData.type}</b>
              <p>Antal rum</p>
              <b>{modalHouseData.rooms} rum</b>
              <p>Boarea</p>
              <b>{modalHouseData.size} m²</b>
            </div>
          </div>
          <br />
        </Modal>
      )}
    </>

  );
};

export default HousesList;
