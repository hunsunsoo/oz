import React, { useState, useEffect } from 'react';
import style from "./TrapLion.module.css"
import GameModal from "../GameModal/GameModal";
import CustomAlert from '../Alert/alert';

const TrapLion = ({ startData, client, sessionId, userId }) => {
  const screen = startData.data.screen;
  const hasKey = startData.data.hasKey;

  const stageval = 2;
  const [showModal, setShowModal] = useState(false);
  const onHandleExplain = () => {
    setShowModal(true);
  };

  const lionMovePublisher = async (type) => {
    if(screen==="wall" && type==="Go"){
      setAlertMessage("벽으로는 갈 수 없어요");
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
        </div>
        <div className={style.lionDiv}>
          <div className={style.lionView}>
            <div onClick={() => lionMovePublisher("L")}>
              <img style={{ width: "60%", height: "100px" }} src="image/game/trapGame/ArrowLeft.png" />
            </div>
            <img src={`image/game/trapGame/${startData.data.screen}.png`} style={{ width: "60%", height: "40%", marginTop: "5%" }}/>
            <div onClick={() => lionMovePublisher("R")}>
              <img style={{ width: "60%", height: "100px" }} src="image/game/trapGame/ArrowRight.png" />
            </div> 
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
        <div className={style.arrowDiv2}>
          <div className={style.goArrow} onClick={() => lionMovePublisher("Go")}>
            <img style={{ width: "30%" }} src="image/game/trapGame/ArrowFront.png" />
          </div>
        </div>
      </div>
      <img
        src="image/tools/questionMark.png"
        alt="questionMark"
        className={style.iconStyle}
        onClick={onHandleExplain} 
      />
      {showModal && (
        <GameModal isStage={stageval} closeModal={() => setShowModal(false)} />
      )}
      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
};

export default TrapLion;