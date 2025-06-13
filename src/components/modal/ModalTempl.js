import "./ModalTempl.css";

const Modal = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{theme.name}</h2>
        <img src={theme.image} alt={theme.name} className="modal-image" />
        <button className="modal-close" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default Modal;
