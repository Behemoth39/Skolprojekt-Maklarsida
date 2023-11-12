import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../contexts/userContext";
import { useNavigate } from 'react-router-dom';

import styles from "../houseCreate/HouseCreate.module.css";

const HouseEdit = () => {
  const navigate = useNavigate();
  const { getToken, isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);

  const { id } = useParams();
  const [house, setHouse] = useState(null);

  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Address, setAddress] = useState("");
  const [Region, setRegion] = useState("");
  const [Type, setType] = useState("Villa");
  const [Size, setSize] = useState("");
  const [Rooms, setRooms] = useState("");
  const [Price, setPrice] = useState("");
  const [Currency, setCurrency] = useState("");
  const [Sold, setSold] = useState("");

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/house/${id}`);
        const data = await response.json();
        setHouse(data);
      } catch (err) {
        console.log("Något gick fel");
        console.log(err.message);
      }
    };

    fetchHouse();
  }, [id]);

  useEffect(() => {
    if (house) {
      setTitle(house.title);
      setDescription(house.description);
      setAddress(house.address);
      setRegion(house.region);
      setType(house.type);
      setSize(house.size);
      setRooms(house.rooms);
      setPrice(house.price);
      setSold(house.sold === null ? 0 : house.sold);
      setCurrency(house.currency);
    }
  }, [house]);

  const HandleUpdate = async (e) => {
    e.preventDefault();
    const house = {
      Title,
      Description,
      Address,
      Region,
      Type,
      Size,
      Rooms,
      Price,
      Currency,
      Pictures: null,
    };
    house.sold = Sold === 0 ? null : Sold;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/house/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(house),
      });
      if (res.ok) {
        navigate('/admin');
      }
    } catch (err) {
      console.log("Något gick fel");
      console.log(err.message);
    }
  };

  return (
    <div className={styles.form}>
      <form className={styles.create} onSubmit={HandleUpdate}>
        <h3>UPPDATERA HUS</h3>


        <label>Titel:</label>
        <input required minLength={3} type='text' onChange={(e) => setTitle(e.target.value)} value={Title} />

        <label>Typ:</label>
        <select onChange={(e) => setType(e.target.value)} value={Type}>
          <option value='Villa'>Villa</option>
          <option value='Lägenhet'>Lägenhet</option>
        </select>

        <label>Gata:</label>
        <input required minLength={3} type='text' onChange={(e) => setAddress(e.target.value)} value={Address} />

        <label>Ort:</label>
        <input required minLength={3} type='text' onChange={(e) => setRegion(e.target.value)} value={Region} />

        <label>Storlek m²:</label>
        <input type='text' onChange={(e) => setSize(e.target.value)} value={Size} />

        <label>Rum:</label>
        <input type='text' onChange={(e) => setRooms(e.target.value)} value={Rooms} />

        <label>Pris:</label>
        <input type='number' onChange={(e) => setPrice(e.target.value)} value={Price} />

        <label>Valuta:</label>
        <input
          type='text'
          onChange={(e) => setCurrency(e.target.value)}
          value={Currency}
        />

        <label>Beskrivning:</label>
        <textarea onChange={(e) => setDescription(e.target.value)} value={Description} />

        <label>Såld för:</label>
        <input type='number' onChange={(e) => setSold(e.target.value)} value={Sold} />

        <button type="submit">Updatera hus</button>
      </form>
    </div>
  );
};

export default HouseEdit;
