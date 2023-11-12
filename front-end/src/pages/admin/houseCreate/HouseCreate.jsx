import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/userContext";
import styles from "./HouseCreate.module.css";
import { useNavigate } from 'react-router-dom';

const HouseCreate = () => {
  const navigate = useNavigate();
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("Lite info");
  const [Address, setAddress] = useState("");
  const [Region, setRegion] = useState("Värnamo");
  const [Type, setType] = useState("Villa");
  const [Size, setSize] = useState("120");
  const [Rooms, setRooms] = useState("7");
  const [Price, setPrice] = useState("3200000");
  const [Currency, setCurrency] = useState("SEK");
  const { isLoggedIn, getToken } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
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

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/house`, {
        method: "POST",
        body: JSON.stringify(house),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        }
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
      <form className={styles.create} onSubmit={handleSubmit}>
        <h3>LÄGG TILL NYTT HUS</h3>

        <label>Titel:</label>
        <input
          type='text'
          placeholder='Titel'
          onChange={(e) => setTitle(e.target.value)}
          value={Title}
          required
          minLength={3}
        />

        <label>Typ:</label>
        <select onChange={(e) => setType(e.target.value)} value={Type}>
          <option value='Villa'>Villa</option>
          <option value='Lägenhet'>Lägenhet</option>
          <option value='Radhus'>Radhus</option>
          <option value='Slott'>Slott</option>
          <option value='Drömkåk'>Drömkåk</option>
        </select>

        <label>Gata:</label>
        <input
          type='text'
          placeholder='Adress'
          onChange={(e) => setAddress(e.target.value)}
          value={Address}
          required
          minLength={3}
        />

        <label>Ort:</label>
        <input
          type='text'
          placeholder='Region'
          onChange={(e) => setRegion(e.target.value)}
          value={Region}
          required
          minLength={3}
        />

        <label>Storlek m²:</label>
        <input
          type='text'
          placeholder='Storlek'
          onChange={(e) => setSize(e.target.value)}
          value={Size}
        />

        <label>Rum:</label>
        <input
          type='number'
          placeholder='Rum'
          onChange={(e) => setRooms(e.target.value)}
          value={Rooms}
        />

        <label>Pris:</label>
        <input
          type='number'
          placeholder='Pris'
          onChange={(e) => setPrice(e.target.value)}
          value={Price}
        />

        <label>Valuta:</label>
        <input
          type='text'
          placeholder='Valuta'
          onChange={(e) => setCurrency(e.target.value)}
          value={Currency}
        />

        <label>Beskrivning:</label>
        <textarea
          placeholder='Beskrivning'
          onChange={(e) => setDescription(e.target.value)}
          value={Description}
        />

        <button type="submit">Lägg till hus</button>
      </form>
    </div>
  );
};

export default HouseCreate;
