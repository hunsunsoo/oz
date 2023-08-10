import React, { useState } from "react";
import { useCookies } from "react-cookie";
import style from "./LandingPage.module.css";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axiosInstance from "../../../_actions/axiosInstance";
import {persistor} from '../../../store'

function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(null);
  const [cookies, setCookies] = useCookies(); // 쿠키와 설정 함수, 삭제 함수 추출

  const reduxAccessToken = useSelector(
    (state) => state.user.loginSuccess?.headers?.accesstoken
  );
  const refreshtoken = useSelector(
    (state) => state.user.loginSuccess?.headers?.refreshtoken
  );

  useEffect(() => {
    // 페이지 로딩 시 accessToken 가져오기
    setAccessToken(reduxAccessToken);
  }, [reduxAccessToken]);

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

  return (
    <div className={style.coverPage}>
      <div className={style.landingpage}>

        {accessToken && (
          <button onClick={() => logOutHandler()}>LogOut</button>
        )}
        <div className={style.dorothy}></div>
        <div className={style.rankingZone}
          onClick={() => navigate(`/rank`)}
        ></div>
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
