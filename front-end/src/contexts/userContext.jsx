/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ErrorContext } from "./errorContext";

export const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  const { setError } = React.useContext(ErrorContext);

  useEffect(() => {
    updateUsername();
  }, [isLoggedIn]);

  /**
   * Authenticates the user with the API and saves the returned token to sessionStorage.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} A Promise that resolves to `true` if the login was successful.
   * @throws {Error} If the API call fails or returns an error.
   */
  async function login(username, password) {
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),

      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        sessionStorage.setItem('token', data.token);
        return true
      } else {
        const status = response.status;
        setError(`Något gick fel. Statuskod: ${status}`);
      }
    } catch (error) {
      setError(`Något gick fel.`);
    }
  }

  function updateUsername() {
    const token = getToken();
    if (token.length === 0) return "";
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decoded = atob(base64);
    const tokenData = JSON.parse(decoded);
    setUsername(tokenData['unique_name']);
    if (tokenData['role'] === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  /**
   * Logs out the user by removing the token from sessionStorage.
   */
  function logout() {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
    return
  }


  /**
   * Returns the token from sessionStorage.
   * @returns {string} The token.
   */
  function getToken() {
    return sessionStorage.getItem('token') || '';
  }



  return (
    <UserContext.Provider value={{ isLoggedIn, username, isAdmin, login, logout, getToken }}>
      {children}
    </UserContext.Provider>
  );
}
