import React from "react";
import style from "./LandingPage.module.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className={style.coverPage}>
      <div className={style.landingpage}>
        <div className={style.character}></div>
        <div className={style.milestone}></div>
        <div className={style.oz}></div>
        <div className={style.ozstory}></div>
        <button
          className={style.gotologin}
          onClick={() => navigate(`/login`)}
        />
        <button
          className={style.gotosignup}
          onClick={() => navigate(`/register`)}
        />
      </div>
    </div>
  );
}

export default LandingPage;
