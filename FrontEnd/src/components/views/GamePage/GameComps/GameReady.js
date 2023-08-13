import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameModal from "./GameModal/GameModal";
import style from "./GameReady.module.css"

const GameReady = ({ stage, myRole, onHandleStart, client, sessionId, R1,R2,R3,R4 }) => {
    
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const host = params.get("host");

  const [amIHost, setAmIHost] = useState(host);
  const [amIReady, setAmIReady] = useState(false);

  const [L1, setL1] = useState(0);
  const [L2, setL2] = useState(0);
  const [L3, setL3] = useState(0);
  const [L4, setL4] = useState(0);
  const [LI1, setLI1] = useState("");
  const [LI2, setLI2] = useState("");
  const [LI3, setLI3] = useState("");
  const [LI4, setLI4] = useState("");

  useEffect(() => {
    if(myRole === 1){
      if(R1 === stage){
        setAmIReady(true);
      } else if(R1 === 0){
        setAmIReady(false);
      }
    } else if(myRole === 2){
      if(R2 === stage){
        setAmIReady(true);
      } else if(R2 === 0){
        setAmIReady(false);
      }
    } else if(myRole === 3){
      if(R3 === stage){
        setAmIReady(true);
      } else if(R3 === 0){
        setAmIReady(false);
      }
    } else if(myRole === 4){
      if(R4 === stage){
        setAmIReady(true);
      } else if(R4 === 0){
        setAmIReady(false);
      }
    } 
  }, [myRole, R1, R2, R3, R4]);

  const handleStartAfterReady = () => {
    console.log(host)
    if(amIHost === "1"){
      if(R1 === stage && R2 === stage && R3 === stage && R4 === stage){
        onHandleStart(true);
      } else {
        alert("4명이 준비 완료 상태가 아닙니다");
      }
    } else {
      alert("내가 방장이 아니다.");
    }
  };

  const ReadyPublisher = async (readyOrCancel) => {  
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      const message = {
        "type":"ready",
        "rtcSession":`${sessionId}`,
        "role":myRole,
        "stage":stage,
        "state":readyOrCancel,
        "message":`${myRole}님이 ${readyOrCancel} (1준비 0취소)하셨습니다`
      };

      client.send('/pub/socket/ready', {}, JSON.stringify(message));
      console.log('메시지 보냈음');
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  const onHandleExplain = () => {
    setShowModal(true);
  };

  // 스테이지별 캐릭터 조건부 렌더링
  if(stage === 1){
    setL1(R3);
    setL2(R1);
    setL3(R2);
    setL4(R4);
    setLI1("image/character/heosu_light.png");
    setLI2("image/character/dorothy.png");
    setLI3("image/character/lionb.png");
    setLI4("image/character/twb.png");
  } else if(stage === 2){
    setL1(R2);
    setL2(R1);
    setL3(R3);
    setL4(R4);
    setLI1("image/character/lion_light.png");
    setLI2("image/character/dorothy.png");
    setLI3("image/character/heosua.png");
    setLI4("image/character/twb.png");
  } else if(stage === 3){
    setL1(R4);
    setL2(R1);
    setL3(R2);
    setL4(R3);
    setLI1("image/character/twm_light.png");
    setLI2("image/character/dorothy.png");
    setLI3("image/character/liona.png");
    setLI4("image/character/heosua.png");
  } else if(stage === 4){
    setL1(R1);
    setL2(R2);
    setL3(R3);
    setL4(R4);
    setLI1("image/character/dorothy_light.png");
    setLI2("image/character/liona.png");
    setLI3("image/character/heosua.png");
    setLI4("image/character/twa.png");
  }

  return (
    <div className={style.compStyle}>
      <div className={style.background_G2}>
        <div className={style.charStyle}>
          <div className={style.firstDiv}>
            <img
              src={LI1}
              className={style.checkMain}>
            </img>
            {L1 === stage && (
              <img
              src="image/tools/checkmarker.png"
              className={style.checkMarkExtra}>
            </img>
            )}
          </div>
          <div className={style.otherDiv}>
            <img
              src={LI2}
              className={style.checkExtra}>
            </img>
            {L2 === stage && (
              <img
              src="image/tools/checkmarker.png"
              className={style.checkMarkExtra}>
            </img>
            )}
          </div>
          <div className={style.otherDiv}>
            <img
              src={LI3}
              className={style.checkExtra}>
            </img>
            {L3 === stage && (
              <img
              src="image/tools/checkmarker.png"
              className={style.checkMarkExtra}>
            </img>
            )}
          </div>
          <div className={style.otherDiv}>
            <img
              src={LI4}
              className={style.checkExtra}>
            </img>
            {L4 === stage && (
              <img
              src="image/tools/checkmarker.png"
              className={style.checkMarkExtra}>
            </img>
            )}
          </div>
        </div>
        <div className={style.guideStyle}>
          <div className={style.topDivStyle}>
            <div className={style.howToPlayImg}>
              게임 방법 넣을 part
            </div>
          </div>
          <div className={style.bottomDivStyle}>
            <div className={style.howToPlayBtn} onClick={onHandleExplain} >
                게임 방법
              </div>
              
              <div className={style.readyBtn} onClick={() => {
                                              const readyOrCancel = amIReady ? 0 : 1;
                                              ReadyPublisher(readyOrCancel);
                                            }}>
                {amIReady ? "준비 취소" : "준비 완료"}
              </div>

              {amIHost === "1" && (
                <div className={style.startBtn} onClick={handleStartAfterReady}>
                  게임 시작
                </div>
              )}
            </div>
        </div>
      </div>
      {showModal && (
        <GameModal isStage={stage} closeModal={() => setShowModal(false)} />
      )}
    </div>
  );

  
  
};

export default GameReady;