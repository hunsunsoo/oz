import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import style from "./ClearPage.module.css";
import axios from "axios";
import {
  OPENVIDU_SERVER_SECRET,
  OPENVIDU_SERVER_URL,
  SERVER_URL,
} from "../../../../_actions/urls";

function ClearPage({roundId}) {
  const [clearTime, setClearTime] = useState(''); // 시간 정보를 저장할 상태
  
    const navigate = useNavigate();
    const navigateToHome = () => {
      navigate(`/`); // 홈 페이지로 이동합니다.
    };

     const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    console.log(roundId + "-> roundId");
      axios
      .get(SERVER_URL + "/rank/team/"+roundId, {
      })
        .then((response) => {
          setClearTime(response.data.accRecord);
      })
      .catch((error) => {
        console.log(error);
      });
    }, []);

  return (
    <div className={style.clearPage}>
      <iframe
        style={{display: "none"}}
        src="/audio/Plop Plop_full.mp3?autoplay=true"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
      ></iframe>
      <div style={{fontSize:"200px", fontWeight:"bold"}}>
        CLEAR
      </div>
      <div style={{fontSize:"40px", fontWeight:"bold"}}>
        CLEAR TIME: {clearTime}
      </div>
      <div className={style.clearPage2}>
        <div className={style.container} onClick={() => navigate(`/rank`)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img className={style.item} src="../image/tools/trophy.png" alt="Image"></img>
        </div>
        <div className={style.container} onClick={navigateToHome} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img className={style.item} src="../image/tools/home.png" alt="Image"></img>
        </div>
      </div>
    </div>
  );
}

export default ClearPage;