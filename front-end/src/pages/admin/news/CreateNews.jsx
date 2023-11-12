/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/userContext";
import styles from "../houseCreate/HouseCreate.module.css";

const HouseEdit = () => {
  const navigate = useNavigate();
  const { getToken, isLoggedIn } = useContext(UserContext);
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, []);


  const HandleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ Title, Content }),
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
        <h3>Skapa Nyhet</h3>

        <label>Titel</label>
        <input required minLength={5} type='text' onChange={(e) => setTitle(e.target.value)} value={Title} />

        <label>Content</label>
        <textarea required type='text' onChange={(e) => setContent(e.target.value)} value={Content} />

        <button type="submit">Lägg till nyhet</button>
      </form>
    </div>
  );
};

export default HouseEdit;
