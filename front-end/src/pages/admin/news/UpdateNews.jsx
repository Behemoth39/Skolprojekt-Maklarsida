import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import styles from "../houseCreate/HouseCreate.module.css";

const HouseEdit = () => {
  const { getToken, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [Title, setTitle] = useState("");
  const [Content, setContent] = useState("");
  const [Published, setPublished] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    }
  }, [isLoggedIn]);


  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/news/${id}`);
        const data = await response.json();
        setTitle(data.title);
        setContent(data.description);
        setPublished(data.published);
      } catch (err) {
        console.log("Något gick fel");
        console.log(err.message);
      }
    };
    fetchNewsItem();
  }, [id]);

  const HandleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ Title, Content, Published }),
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
        <h3>Uppdatera Nyheter</h3>

        <label>Titel</label>
        <input required minLength={5} type='text' onChange={(e) => setTitle(e.target.value)} value={Title} />

        <label>Content</label>
        <textarea required type='text' onChange={(e) => setContent(e.target.value)} value={Content} />

        <button type="submit">Uppdatera Nyhet</button>
      </form>
    </div>
  );
};

export default HouseEdit;
