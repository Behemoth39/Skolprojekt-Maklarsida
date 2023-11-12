import { useContext, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import styles from "./CreateUser.module.css";

export const CreateUser = () => {
  const { getToken } = useContext(UserContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [userAdded, setUserAdded] = useState(false);

  async function getUsers() {
    const token = getToken();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`,
      }
    });
    if (response.ok) {
      const data = await response.json();
      setUserList(data);
    } else {
      console.log("Något gick fel");
    }
  }

  function openModal() {
    setModalOpen(true);
    getUsers();
  }
  function closeModal() {
    setModalOpen(false);
    setError("");
    setUserAdded(false);
  }

  async function createNewUser(e) {
    e.preventDefault();
    setError("");

    const token = getToken();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (response.ok) {
      setUserAdded(true);
      setUserList([]);
      getUsers();
    } else {
      setError("Errorcode: " + response.status);
    }
  }

  return (
    <>
      <button className={styles.button} onClick={openModal}>Skapa ny användare</button>
      {modalOpen && (
        <div className={styles.modalOuter}>
          <div className={styles.modalInner}>
            <button className={styles.closeButton} onClick={closeModal}>Stäng</button>
            <h3>Aktuella användare</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Användarnamn</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <br />
            <h3>Lägg till ett nytt mäklarkonto (ej admin)</h3>
            <p className={styles.error}>{error}</p>
            {userAdded && (
              <>
                <div>User "{username}" has been added.</div>
                <button className={styles.buttonAnotherUser} onClick={() => setUserAdded(false)}>Skapa en till användare</button>
              </>
            )}
            {!userAdded && (
              <form className={styles.form} autoComplete="off" onSubmit={createNewUser} method="post" >
                <label htmlFor="un">Användarnamn:</label>
                <input type="text" id="un" name="un" required autoComplete="off" placeholder="username" minLength={3} onChange={e => setUsername(e.target.value)} />
                <label htmlFor="pw">Lösenord:</label>
                <input type="text" id="pw" name="pw" required autoComplete="off" placeholder="password" minLength={4} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Skapa</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

