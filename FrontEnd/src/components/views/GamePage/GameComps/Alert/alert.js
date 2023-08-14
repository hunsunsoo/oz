import React from "react";
import style from "./alert.module.css";

const CustomAlert = ({ message, onClose }) => {
  return (
    <div className={style.alertBox}>
      <div className={style.firstDiv}>
        <div className={style.message}>{message}</div>

        <button className={style.closeButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
