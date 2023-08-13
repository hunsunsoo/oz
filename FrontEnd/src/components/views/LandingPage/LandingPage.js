import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import style from "./LandingPage.module.css";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../_actions/axiosInstance";
import MakeRoomModal from "./MakeRoomModal";
import {persistor} from '../../../store'

function LandingPage() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [cookies, setCookies] = useCookies(); // 쿠키와 설정 함수, 삭제 함수 추출
  const [isVisibledModal, setIsVisibledModal] = useState(false);

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

const showModal = () => {
  setIsVisibledModal(true);
};


  return (
    <div className={style.coverPage}>
      <div className={style.landingpage}>
        <div className={style.dorothy}></div>
        {accessToken && (
          <div className={style.rankingZone}
            onClick={() => navigate(`/rank`)}
          ></div>
        )}

        {accessToken ? (
          <div className={style.afterLoginMilestoneDiv}>
            <div className={style.afterLoginMilestone}></div>
              <button
                className={style.goToMypage}
                onClick={() => navigate(`/mypage`)}
              >마이페이지</button>
              <button
                className={style.makeRoom}
                onClick={showModal}
              >게임 시작</button>
              <button
                className={style.logout}
                onClick={() => logOutHandler()}
              >로그아웃</button>
            </div>
          ) : (
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
          )
        }

        {isVisibledModal && (
          <MakeRoomModal setIsVisibledModal={setIsVisibledModal} />
        )}
        
        
      </div>
    </div>
  );
}

export default LandingPage;
