import React, { useEffect, useState } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';

import styles from "./Login.module.css";

export const Login = () => {
  const navigate = useNavigate()
  const { login } = React.useContext(UserContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    document.title = "Logga in";
  }, []);


  async function handleLogin(e) {
    e.preventDefault();
    if (await login(username, password)) {
      // use react-router to send to /admin
      navigate('/admin');
    }
  }

  return (
    <div className={styles.login}>
      <form onSubmit={handleLogin} >
        <h1>LOGGA IN SOM MÄKLARE</h1>
        <label>
          <p>Användarnamn</p>
          <input type="text" minLength={3} required onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          <p>Lösenord</p>
          <input type="password" minLength={3} required onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Logga in</button>
        </div>
      </form>
    </div>
  )
}

