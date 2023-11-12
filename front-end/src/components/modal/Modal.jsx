import React from "react";
import ReactDOM from "react-dom";
import closeIcon from "../../assets/icons/close-svgrepo-com-red.svg";

import styles from "./Modal.module.css";

const Modal = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <img src={closeIcon} className={styles.closeButton} onClick={onClose} alt="close" />
        {children}
        <button className={styles.modalCloseAltBtn} onClick={onClose}>Stäng</button>
      </div>
    </div>,
    document.body
  );
};

export default Modal;