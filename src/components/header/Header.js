import header_bg from "./../../img/images/header-bg.png";
import "./hd_style.css";

import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="header">
      <img className="h__bg" src={header_bg} alt="заполнение" />
      <div className="header__wrapper">
        <h1 className="header__title">
          Онлайн конструктор для создания резюме
        </h1>

        <div className="header__text">
          <p>Профессиональное резюме всего за 5 минут</p>
        </div>
        <Link to="/create" className="btn">
          Создать резюме
        </Link>
      </div>
    </header>
  );
};

export default Header;
