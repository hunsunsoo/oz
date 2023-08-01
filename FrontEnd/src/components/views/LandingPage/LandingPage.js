import React from "react";
import style from "./LandingPage.module.css";
import { useNavigate } from "react-router-dom";
import MyButton from "../../tools/MyButton";
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className={style.landingpage}>
        <div
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <MyButton text={"로그인"} onClick={() => navigate(`/login`)} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
