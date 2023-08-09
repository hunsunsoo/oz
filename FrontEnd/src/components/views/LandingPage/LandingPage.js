import React from "react";
import style from "./LandingPage.module.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className={style.coverPage}>
      <div className={style.landingpage}>
        <div className={style.milestone}>
        <button
          className={style.gotologin}
          onClick={() => navigate(`/login`)}
        >
        로그인</button>
        <button
          className={style.gotosignup}
          onClick={() => navigate(`/register`)}
        >회원가입</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
