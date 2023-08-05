import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./Password.module.css";
import InputCode from "./InputCode";
import { useState } from "react";
import InputPassword from "./InputPassword";
const PasswordChange = () => {
  const navigate = useNavigate;
  const dispatch = useDispatch;
  const [isauthSuccess, setIsAuthSuccess] = useState(false);
  return (
    <div>
      <div className={style.box}>
        {isauthSuccess ? (
          <InputPassword />
        ) : (
          <InputCode setIsAuthSuccess={setIsAuthSuccess} />
        )}
      </div>
    </div>
  );
};

export default PasswordChange;
