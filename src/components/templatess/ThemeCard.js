import "./ThemeCard.css";

const ThemeCard = ({ theme, onClick, selected }) => {
  return (
    <div
      className={`theme-card${selected ? " selected" : ""}`}
      onClick={onClick}
    >
      <div className="theme-card__image">
        <img
          src={theme.image}
          alt={`Шаблон ${theme.id}`}
          onError={(e) => (e.target.src = "/img/placeholder.png")}
        />
      </div>
      <div className="theme-card__content">
        <h3 className="theme-card__title">{theme.name}</h3>
      </div>
    </div>
  );
};

export default ThemeCard;
