import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

const PuzzleTwm = ({ startData, client, sessionId, userId }) => {
  const numberOfBoards = 6;
  const location = startData.location;
  const puzzle = startData.puzzle;

  const locationArray = Array.from(String(location), Number);
  const imageIds = puzzle.split(",");

  const initialBoardsFromBackend = [];

  // 게임로그 publisher
  const sendLogData = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
          
      const message = {
        "userId":userId,
        "isSystem":0,
        "logType":1,
        "message":`${userId}+번님이 1위치에 3을 넣었습니다`,
        "rtcSession": sessionId
    };

      client.send('/pub/puzzle/log', {}, JSON.stringify(message));
      console.log(message)
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // 게임정답제출 publisher
  const sendPuzzleAnswer = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
          
      const message = {
        "rtcSession":sessionId,
        "userId": userId,
        "userAnswer": "1:56, 2:12, 3:22",
        "check": 1
      };

      client.send('/pub/puzzle/data', {}, JSON.stringify(message));
      console.log(message)
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // 나머지 빈 보드 추가
  for (let i = 0; i < 6; i++) {
    if (locationArray.includes(i + 1)) {
      const locationIndex = locationArray.indexOf(i + 1);
      const imageId = parseInt(imageIds[locationIndex], 10);
      const url = `/image/game/puzzleGame/puzzlePiece/${imageId}.png`;

      const board = {
        id: imageId,
        url: url,
        fixed: true,
      };

      initialBoardsFromBackend.push(board);
    } else {
      const emptyBoard = { id: null, url: null, fixed: false };
      initialBoardsFromBackend.push(emptyBoard);
    }
  }

  const [boards, setBoards] = useState(initialBoardsFromBackend);
  
  // const handleDrop = (boardIndex, pictureId) => {
  //   sendLogData(
  //     props.client,
  //     props.session,
  //     props.userId,
  //     boardIndex,
  //     pictureId
  //   );
  //   if (boards[boardIndex].fixed) return; // 고정된 칸은 드롭 무시

  //   const picture = PictureList.find((p) => p.id === pictureId);
  //   setBoards((prevBoards) => {
  //     const newBoards = [...prevBoards];
  //     newBoards[boardIndex] = { ...picture, fixed: false }; // 고정되지 않은 이미지
  //     return newBoards;
  //   });
  // };

  // const handleSendAnswerCheck = () => {
  //   const userAnswerString = getUserAnswerString(boards, locationArray);
  //   sendAnswerCheck(
  //     props.client,
  //     props.session,
  //     props.userId,
  //     userAnswerString
  //   );
  // };

    return (
      <div>
        {/* <div className={style.container}>
          <div className={style.puzzleLeft}>
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
          {PictureList.map((picture) => (
            <div
              className="Picture"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(1, 1fr)", // 하나의 열을 생성
                gridTemplateRows: "repeat(1, 1fr)", // 하나의 행을 생성
                gap: "10px", // 각 그리드 항목 사이의 간격
                width: "16.66%", // 전체 너비를 6으로 나눔 (6x6 그리드)
                float: "left", // 혹은 flex를 사용할 수 있습니다.
              }}
            >
              <Picture key={picture.id} url={picture.url} id={picture.id} />
            </div>
          ))}
        </div>
        <button onClick={handleSendAnswerCheck}>정답 확인</button>
      </div>
      <img
        src="image/tools/questionMark.png"
        alt="questionMark"
        className={style.iconStyle}
      />
      {/* <div className={style.stage3SelectBtn} onClick={props.changeIsClear}>
        선택완료
      </div> */}
      여긴 양나의 페이지야
    </div>
    );

  
  };
export default PuzzleTwm;