import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../_actions/user_action";
import style from "./AuthLandingPage.module.css";
import React from "react";

function AuthLandingPage(props) {
  const [cookies, setCookies] = useCookies(); // 쿠키와 설정 함수, 삭제 함수 추출
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // logout
  const logOutHandler = () => {
    dispatch(logoutUser());
    setCookies("Atoken", "", { expires: new Date() }); // "token" 쿠키 삭제
    console.log(cookies);
    navigate("/");
    window.location.reload();
    console.log(cookies);
  };

  return (
    <div>
      <div className={style.coverPage}>
        <div className={style.landingpage}>
          <div className={style.character}></div>
          <div className={style.milestone}></div>
          <div className={style.oz}></div>
          <div className={style.ozstory}></div>

          <button onClick={() => logOutHandler()}>LogOut</button>
          <button className="button" onClick={() => navigate(`/withdrawl`)}>
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthLandingPage;
