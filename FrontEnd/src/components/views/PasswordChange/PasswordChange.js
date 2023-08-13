import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Password.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import {persistor} from '../../../store'
import axiosInstance from "../../../_actions/axiosInstance";


const PasswordChange = () => {
  const [cookies, setCookies] = useCookies(); // 쿠키와 설정 함수, 삭제 함수 추출
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [Confirmpassword, setConfirmPassword] = useState("");

  const accessToken = useSelector(
    (state) => state.user.loginSuccess?.headers?.accessToken
  );
  const refreshtoken = useSelector(
    (state) => state.user.loginSuccess?.headers?.refreshtoken
  );

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onNewPasswordHandler = (e) => {
    setNewPassword(e.currentTarget.value);
  };

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const logOutHandler = () => {
    axiosInstance
      .post(
        "users/logout",
        {},
        {
          headers: {
            AccessToken: accessToken,
            Refreshtoken: refreshtoken,
          },
        }
      )
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((err) => {
        console.log(err);
      });

      persistor.purge();
      setCookies("Atoken", "", { expires: new Date() }); // "token" 쿠키 삭제
      setCookies("Rtoken", "", { expires: new Date() }); // "token" 쿠키 삭제
      console.log(cookies);
      window.location.href="/";
      console.log(cookies);
  };

  const onSubmitPasswordHandler = async (e) => {
    e.preventDefault();

    if(Confirmpassword !== Newpassword){
      return alert("변경할 비밀번호를 다시 확인해 주세요");
    };


    let body = {
      password: password,
      newPassword: Newpassword,
    };
    console.log("password: " + password + ", newPassword: " + Newpassword);

    axiosInstance
      .put("/users/update/password", body, {
        headers: {
          AccessToken: accessToken,
        },
      })
      .then((response) => {
        console.log(response);
        logOutHandler();
      })
      .catch((error) => {
        alert("현재 비밀번호를 다시 확인해 주세요.");
      });
  };

  return (
    <div className={style.changepage}>
        <div className={style.box}>
          <div className={style.logo}>
              <img className={style.logoImage} 
              src= {process.env.PUBLIC_URL + "/image/logo/real_logo.png"}
              onClick={() => navigate(`/`)}></img>
          </div>
          <div className={style.allBox}>

            <div className={style.topBox}>
              <div className={style.frontZone}>
              </div>
              <input className={style.inputZone}
              type="password"
              value={password}
              onChange={onPasswordHandler}
              placeholder="현재 비밀번호를 입력해 주세요"
              >
              </input>
            </div>

            <div className={style.bottomBox}>
              <div className={style.frontZone}>
              </div>
              <input className={style.inputZone}
              type="password"
              value={Newpassword}
              onChange={onNewPasswordHandler}
              placeholder="변경할 비밀번호를 입력해 주세요"
              >
              </input>
            </div>

            <div className={style.bottomBox}>
              <div className={style.frontZone}>
              </div>
              <input className={style.inputZone}
              type="password"
              value={Confirmpassword}
              onChange={onConfirmPasswordHandler}
              placeholder="비밀번호 확인"
              >
              </input>
            </div>

            <div className={style.registDiv}>
              <button className={style.Button}
                onClick={onSubmitPasswordHandler}>비밀번호 변경</button>
            </div>
            <div className={style.changeDiv}>
              <button className={style.Button}
                onClick={() => navigate("/mypage")}>뒤로가기</button>
            </div>
          </div>
          </div>
        </div>
  );
}


export default PasswordChange;
