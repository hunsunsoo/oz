import React, { useState } from "react";
import style from "./WaitingRoomOption.module.css";
import axios from "axios";

const WaitingRoomOption = ({ isWaiting, onGamingStart, userId, sessionId, amIHost }) => {

  const OPENVIDU_SERVER_URL = "https://i9b104.p.ssafy.io:8443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";
  const SERVER_URL = 'http://localhost:8080'

  const handleGamingStartState = () => {
    if(amIHost == 1) {
      axios.get(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
            {
              headers: {
                Authorization: `Basic ${btoa(
                  `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
                )}`,
              },
            }
          ).then((response) => {
            const participantCount = response.data.numberOfElements;
            if (participantCount < 4) {
              alert(
                "참가 인원(4명)이 충족되지 않았습니다. 시작이 불가능합니다."
              );
            } else {
              axios.post(`${SERVER_URL}/socket/user?rtcSession=${sessionId}`,{}
              ).then((response) => {
                const userIdArray = response.data.data.map(obj => obj.userId);
                axios.post(`${SERVER_URL}/teams/checkteam`,{
                  "users" : userIdArray
                }
                ).then((response) => {
                  console.log(response.data.data);
                  const teamNameDefault = response.data.data.teamName;
                  var teamName;
                  if (teamNameDefault === null){
                    teamName = prompt("사용할 팀 이름을 정하세요");
                  } else {
                    teamName = prompt(`해당 4명의 사용자는 기존에 사용하던 팀 명이 있습니다. ${teamNameDefault} 이거 쓰던거 쓰려면 아무것도 입력하지말고 넘기시고 새로 팀만들고싶으면 적으세요 이건나중에 바꿀거에요`, teamNameDefault )
                  }
                  console.log(teamName+"이름으로 팀만들었고 다음페이지로 넘어가는거 만드는중")
                  axios.post(`${SERVER_URL}/teams/registteam`, {
                    "users" : userIdArray,
                    "teamName" : `${teamName}`
                  })
                  .then(response => {
                    
                    console.log(response.data);
                  })
                  .catch(error => {
                    console.error(error);
                  });
                }
                );
                })
              }
            })
          .catch((error) => {
            console.log("방 정보를 가져오는데 실패하였습니다.", error);
          });
    } else {
      alert("내가 방장이 아니다.")
    }
  };

  const WROStyle = {
    backgroundColor: "rgb(221, 229, 182)",
    height: "20%",
    display: "flex",
  };

  return (
    <div style={WROStyle}>
      <div className={style.optionBox}>
        {/* Left Pane Content */}
        <button className={style.optionButton}><i class="fi fi-rr-microphone"></i></button>
        <button className={style.optionButton}><i class="fi fi-rr-video-camera-alt"></i></button>
        <button className={style.optionButton}><i class="fi fi-rr-settings"></i></button>
        <button className={style.optionButton}><i class="fi fi-rr-envelope-plus"></i></button>
      </div>
      <div className={style.nextBox}>
        {/* Right Pane Content */}
        <button className={style.nextButton} onClick={handleGamingStartState}>
          모험시작
        </button>
        <button className={style.nextButton}>나가기</button>
      </div>
    </div>
  );
};

export default WaitingRoomOption;
