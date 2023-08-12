import React, { useState, useEffect } from 'react';
import style from "./TrapReady.module.css"
import { useLocation } from "react-router-dom";

const TrapReady = ({myRole, onHandleStart, client, sessionId, R1,R2,R3,R4}) => {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const host = params.get("host");

  const [amIHost, setAmIHost] = useState(host);
  const [amIReady, setAmIReady] = useState(false);

  useEffect(() => {
    if(myRole === 1){
      if(R1 === 2){
        setAmIReady(true);
      } else if(R1==0){
        setAmIReady(false);
      }
    } else if(myRole === 2){
      if(R2 === 2){
        setAmIReady(true);
      } else if(R1==0){
        setAmIReady(false);
      }
    } else if(myRole === 3){
      if(R3 === 2){
        setAmIReady(true);
      } else if(R1==0){
        setAmIReady(false);
      }
    } else if(myRole === 4){
      if(R4 === 2){
        setAmIReady(true);
      } else if(R1==0){
        setAmIReady(false);
      }
    } 
  }, [myRole, R1, R2, R3, R4]);

  const handleStartAfterReady = () => {
    console.log(host)
    if(amIHost === "1"){
      if(R1 === 2 && R2 === 2 && R3 === 2 && R4 === 2){
        onHandleStart(true);
      } else {
        alert("4명이 준비 완료 상태가 아닙니다");
      }
    } else {
      alert("내가 방장이 아니다.");
    }
  };

  const trapReadyPublisher = async (readyOrCancel) => {  
      try {
        if (!client) {
          console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
          return;
        }

        const message = {
          "type":"ready",
          "rtcSession":`${sessionId}`,
          "role":myRole,
          "stage":2,
          "state":readyOrCancel,
          "message":`${myRole}님이 ${readyOrCancel} (1준비 0취소)하셨습니다`
        };

        client.send('/pub/socket/ready', {}, JSON.stringify(message));
        console.log('메시지 보냈음');
      } catch (error) {
        console.log('Error sending message:', error);
      }
  };


  return(
    <div className={style.compStyle}>
        <div className={style.background_G2}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          {/* <div className={style.readyBtn} onClick={props.changeIsReady}> */}
          <div className={style.readyBtn} onClick={() => {
                                          const readyOrCancel = amIReady ? 0 : 1;
                                          trapReadyPublisher(readyOrCancel);
                                        }}>
            {amIReady ? "준비 취소" : "준비 완료"}
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
          <div className={style.startBtn} onClick={handleStartAfterReady}>
            게임 시작
          </div>
          <img
            src="image/tools/checkmarker.png"
            className={style.checkDorothy}
            style={{ display: R1 === 2 ? 'block' : 'none' }}
          >
          </img>
          <img
            src="image/tools/checkmarker.png"
            className={style.checkLion}
            style={{ display: R2 === 2 ? 'block' : 'none' }}
          >
          </img>
          <img
            src="image/tools/checkmarker.png"
            className={style.checkHeosu}
            style={{ display: R3 === 2 ? 'block' : 'none' }}
          >
          </img>
          <img
            src="image/tools/checkmarker.png"
            className={style.checktwm}
            style={{ display: R4 === 2 ? 'block' : 'none' }}
          >
          </img>
        </div>
      </div>
  );
};

export default TrapReady;