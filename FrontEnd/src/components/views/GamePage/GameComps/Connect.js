import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import style from "./GameComps.module.css";


const Image = ({ src, alt }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "image",
      item: { src, alt },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    return (
      <img
        ref={drag}
        src={src}
        alt={alt}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    );
  };


    
export function Sub ({client, myRole, myTeamId, session, userId}){
    //게임 시작 데이터
    client.subscribe(`/sub/socket/puzzle/start/${myRole}/${session}`, (message) => {
      console.log('Start Received message:', message.body);
      try {
        // JSON 문자열을 JavaScript 객체로 변환
        const resJsondata = JSON.parse(message.body);  
    
        // 객체의 속성을 활용하여 처리
        const resRole = resJsondata.role;

        console.log(resRole);

      } catch (error) {
        console.error('Start Error parsing message body:', error);
      }

    });

    //정답 확인 데이터 
    client.subscribe(`/sub/socket/puzzle/data/${session}`, (message) => {
        console.log('Data Received message:', message.body);
        try {
          // JSON 문자열을 JavaScript 객체로 변환
          const resJsondata = JSON.parse(message.body);  
      
          // 객체의 속성을 활용하여 처리
          const resRole = resJsondata.role;
  
          console.log(resRole);
  
        } catch (error) {
          console.error('Data Error parsing message body:', error);
        }
    });
}

function sendGameStart(client, session, userId){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "rtcSession" : session,
        "userId": userId,
        "turn": "1",
    };

    client.send(`/pub/puzzle/start`, {}, JSON.stringify(message));
}

function sendLogData(client, session, userId){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "userId":userId,
        "isSystem":0,
        "logType":1,
        "message":`${session}+번님이 1위치에 3을 넣었습니다`,
        "rtcSession": session
    };

    console.log("sendLogData :"+JSON.stringify(message));
    client.send(`/pub/puzzle/log`, {}, JSON.stringify(message));
}

function answerCheck(client, session, userId){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "rtcSession":session,
        "userId": userId,
        "userAnswer": "1:56, 2:12, 3:22",
        "check": 1
    };

    client.send(`/pub/puzzle/data`, {}, JSON.stringify(message));
}

export function Dnd({props, client, myRole, session, userId}) {

    sendGameStart(client, session, userId);
    sendLogData(client, session, userId);
    answerCheck(client, session, userId);

  return (
    <div className={style.compStyle}>
      <div className={style.container}>
        <div className={style.puzzleLeft}>
          <img
            src="/image/game/puzzleGame/puzzleGameBgHeart.JPG"
            alt=""
            className={style.puzzleImage}
          />
        </div>
        <DndProvider backend={HTML5Backend}>
          <div className={style.puzzleRight}>
            {Array.from({ length: 6 }, (_, row) =>
              Array.from({ length: 6 }, (_, col) => (
                <div key={row * 6 + col} className={style.gridImage}>
                  <Image
                    src={`/image/game/puzzleGame/puzzlePiece/${
                      (row + 1) * 10 + (col + 1)
                    }.png`} // 이미지 파일의 경로를 동적으로 생성
                    alt={`Image ${row * 6 + col + 1}`}
                  />
                </div>
              ))
            )}
          </div>
        </DndProvider>
      </div>

      <img
        src="image/tools/questionMark.png"
        alt="questionMark"
        className={style.iconStyle}
      />
      <div className={style.stage3SelectBtn} onClick={props.changeIsClear}>
        선택완료
      </div>
    </div>
  );
}
