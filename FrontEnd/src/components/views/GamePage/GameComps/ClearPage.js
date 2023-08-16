import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import style from "./ClearPage.module.css";
import axiosInstance from "../../../../_actions/axiosInstance";

function ClearPage(roundId) {
    const [clearTime, setClearTime] = useState(''); // 시간 정보를 저장할 상태
    const navigate = useNavigate();
    const navigateToHome = () => {
      navigate(`/`); // 홈 페이지로 이동합니다.
    };

  useEffect(() => {
    // API를 호출하여 데이터 가져오기
    try {
      console.log("@@@@@@@@@"+roundId);
      const response = axiosInstance.get("/rank/team/"+roundId);
      console.log(response.data);
      if (response.status === 200) {
        alert(response.data);
      }
    } catch (error) {
      alert("올바르지 않은 이메일입니다");
    }
  }, []);

  return (
    <div className={style.clearPage}>
    <div style={{fontSize:"200px", fontWeight:"bold"}}>
      CLEAR
    </div>
    <div style={{fontSize:"40px", fontWeight:"bold"}}>
      CLEAR TIME: {clearTime}
    </div>
    <div className={style.clearPage2}>
      <div className={style.container} onClick={() => navigate(`/rank`)}>
        <img className={style.item} src="../image/tools/trophy.png" alt="Image"></img>
      </div>
      <div className={style.container} onClick={navigateToHome}>
        <img className={style.item} src="../image/tools/home.png" alt="Image"></img>
      </div>
    </div>
  </div>
  );
}

export default ClearPage;