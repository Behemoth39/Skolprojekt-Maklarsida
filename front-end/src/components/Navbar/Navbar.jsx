import { useContext } from "react";
import "./Navbar.css";
import { UserContext } from "../../contexts/userContext";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(UserContext);
  return (
    <>
      <div className="navbar__height"></div>
      <nav className="navbar">
        <ul>
          <li>
            <NavLink to="/">Hem</NavLink>
          </li>
          <li>
            <NavLink to="/sales">Säljhistorik</NavLink>
          </li>
          {!isLoggedIn && (
            <li>
              <NavLink to="/login">Logga in</NavLink>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li>
                <NavLink to="/admin">Admin</NavLink>
              </li>
              <button onClick={() => logout()}>Logga ut</button>
            </>
          )}
        </ul>
      </nav >
    </>
  );
};

export default Navbar;
