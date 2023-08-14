import React, { useState, useEffect } from 'react';
import style from "./TrapLion.module.css"

const TrapLion = ({ startData, client, sessionId, userId }) => {

  
  const screen = startData.data.screen;
  const hasKey = startData.data.hasKey;

  const lionMovePublisher = async (type) => {
    if(screen==="wall" && type==="Go"){
      alert("벽으로는 갈 수 없어요");
      return;
    } else{
      try {
        if (!client) {
          console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
          return;
        }
        console.log(userId)
            
        const message = {
          "rtcSession":`${sessionId}`,
          "userId":userId,
          "moving":`${type}`
        };

        client.send('/pub/trap/move', {}, JSON.stringify(message));
        console.log('메시지 보냈음');
      } catch (error) {
        console.log('Error sending message:', error);
      }
    }
  };

  

  return(
    <div className={style.compStyle}>
      <div className={style.backgroundDiv}>
        <div className={style.arrowDiv}>
          <div className={style.arrowPart}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ width: "54px", visibility: "hidden"}}>
                <img src="image/game/trapGame/ArrowBack.png"/>
              </div>
              <div style={{ width: "54px" }} onClick={() => lionMovePublisher("Go")}>
                <img src="image/game/trapGame/ArrowFront.png"/>
              </div>
              <div style={{ width: "54px", visibility: "hidden"}}>
                <img src="image/game/trapGame/ArrowBack.png"/>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ width: "54px" }} onClick={() => lionMovePublisher("L")}>
                <img src="image/game/trapGame/ArrowLeft.png"/>
              </div>
              <div style={{ width: "54px" }}>
                <img src="image/game/trapGame/ArrowBack.png"/>
              </div>
              <div style={{ width: "54px" }} onClick={() => lionMovePublisher("R")}>
                <img src="image/game/trapGame/ArrowRight.png"/>
              </div>
            </div>
          </div>
        </div>
        <div className={style.lionDiv}>
          <div className={style.lionView}>
            <img src={`image/game/trapGame/${startData.data.screen}.png`} style={{ width: "75%", height: "60%", marginTop: "5%" }}/>
          </div>
          {hasKey === 1 ? (
              <div className={style.txtStyle}>
                열쇠를 획득했어~!~! 함정을 피해 도착지점으로 가자~!!
              </div>
            ) : (
              <div className={style.txtStyle}>
                열쇠가 있어야 탈출할 수 있어! 열쇠와의 거리는 {startData.data.distanceKey}칸 이야!
              </div>
            )}
        </div>
      </div>
      <img
        src="image/tools/questionMark.png"
        alt="questionMark"
        className={style.iconStyle}
      />
    </div>
  );
};

export default TrapLion;