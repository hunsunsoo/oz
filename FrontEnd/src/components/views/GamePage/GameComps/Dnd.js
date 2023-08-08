<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Picture from "./Picture";
import style from "./GameComps.module.css";

const PictureList = [];
for (let i = 1; i <= 6; i++) {
  for (let j = 1; j <= 6; j++) {
    const id = i * 10 + j;
    const key = i * 10 + j;
    const url = `/image/game/puzzleGame/puzzlePiece/${id}.png`;
    PictureList.push({ id, url });
  }
}

// PictureList 리스트 안에 36개 이중반복으로 이미지 아이디 및 경로 설정

function Board({ index, picture, onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: "image", // "image" 유형의 드래그 가능한 항목만 허용.
    drop: (item) => onDrop(index, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // 드롭 영역 위에 있는지 감시.
    }),
  });

  return (
    <div
      ref={drop}
      //   ref는 React에서 사용하는 특별한 속성으로, DOM 요소 또는 컴포넌트에 직접 접근할 수 있게 해준다-> 이 div의 ref속성은 drop이다
      style={{
        width: "50px",
        height: "50px",
        border: "2px solid black",
        display: "inline-block",
        margin: "10px",
        backgroundColor: isOver ? "rgba(0, 255, 0, 0.2)" : "white",
      }}
      className={`Board board-${index}`}
    >
      {picture && <Picture url={picture.url} id={picture.id} />}
    </div>
  );
}

function Dnd(props) {
  const numberOfBoards = 6;

  // 백엔드에서 받아올 수 있는 정답 키값 (전체 6개 중 3개만 사용)
  const correctAnswers = [11, 12, 13];

  // 초기 보드 설정. 처음 3개는 고정된 이미지로 설정하고, 나머지 3개는 null,
  // 여기에 백에서 보드(6개중에 위치랑 어떤 이미지 채울지 로직 작성해야)
  const initialBoards = [
    PictureList.find((p) => p.id === 11), // 고정된 이미지
    PictureList.find((p) => p.id === 12), // 고정된 이미지
    null,
    PictureList.find((p) => p.id === 13), // 고정된 이미지
    null,
    null,
  ];

  // 초기 보드를 useState로 설정
  const [boards, setBoards] = useState(initialBoards);

  const handleDrop = (boardIndex, pictureId) => {
    if (boardIndex < 3) return; // 처음 3개 칸은 고정되어 있으므로 드롭 무시

    const picture = PictureList.find((p) => p.id === pictureId);
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      newBoards[boardIndex] = picture;
      return newBoards;
    });
  };

  const checkAnswers = () => {
    for (let i = 3; i < numberOfBoards; i++) {
      // 나머지 3개 칸만 확인
      if (!boards[i] || boards[i].id !== correctAnswers[i - 3]) {
        alert("틀렸습니다. 다시 시도해주세요.");
        setBoards(initialBoards); // 보드 상태 초기화
        return;
      }
    }
    alert("정답입니다! 축하합니다.");
  };
>>>>>>> f13ee8e18b5bfeae522145fe0ea6ccaddcd426d8

  return (
    <div className={style.compStyle}>
      <div className={style.container}>
        <div className={style.puzzleLeft}>
<<<<<<< HEAD
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

=======
          <div
            className="Boards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // 3개의 열을 생성
              gridTemplateRows: "repeat(3, 1fr)", // 2개의 행을 생성
              gap: "30px", // 각 그리드 항목 사이의 간격
            }}
          >
            {boards.map((picture, index) => (
              <Board
                key={index}
                index={index}
                picture={picture}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>

        <div className={style.puzzleRight}>
          <div
            className="Picture"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)", // 6개의 열을 생성
              gridTemplateRows: "repeat(6, 1fr)", // 6개의 행을 생성
              gap: "10px", // 각 그리드 항목 사이의 간격
              //   overflow: "hidden",
            }}
          >
            {PictureList.map((picture) => {
              return (
                <Picture key={picture.id} url={picture.url} id={picture.id} />
              );
            })}
          </div>
        </div>
        <button onClick={checkAnswers}>정답 확인</button>
      </div>
>>>>>>> f13ee8e18b5bfeae522145fe0ea6ccaddcd426d8
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
<<<<<<< HEAD
=======

export default Dnd;
>>>>>>> f13ee8e18b5bfeae522145fe0ea6ccaddcd426d8
