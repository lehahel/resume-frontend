import { NavLink, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./style.css";

const baseLinks = [
  { to: "/", end: true },
  { to: "/create", label: "Составить резюме" },
  { to: "/themess", label: "Шаблоны" },
  { to: "/about", label: "О сайте" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <nav className="nav">
      <div className="container nav-row">
        <Link to="/" className="logo">
          GO WORK
        </Link>

        <ul className="nav-list">
          {baseLinks.map(({ to, label, end }) => (
            <li key={to} className="nav-list__item">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  "nav-list__link" + (isActive ? " nav-list__link--active" : "")
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

          {!user ? (
            <li className="nav-list__item">
              <NavLink
                to="/authh"
                className={({ isActive }) =>
                  "nav-list__link" + (isActive ? " nav-list__link--active" : "")
                }
              >
                Войти
              </NavLink>
            </li>
          ) : (
            <li
              className="nav-list__item nav-list__item--user"
              ref={dropdownRef}
            >
              <button
                className="nav-list__link nav-list__link--button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                {user.name || user.username || user.email}{" "}
                <span className="arrow">{open ? "" : ""}</span>
              </button>
              {open && (
                <ul className="dropdown-list" role="menu">
                  <li role="none">
                    <NavLink
                      to="/authh"
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      Личный кабинет
                    </NavLink>
                  </li>
                  <li role="none">
                    <button
                      className="dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Выйти
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
