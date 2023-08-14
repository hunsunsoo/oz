import React, { useState } from "react";
import Picture from "./Picture";
import style from "./PuzzleGame.module.css";
import Board from "./PuzzleBoard";

const PuzzleTwm = ({ startData, client, sessionId, userId }) => {
  const numberOfBoards = 6;
  const location = startData.location;
  const puzzle = startData.puzzle;

  const locationArray = Array.from(String(location), Number);
  const imageIds = puzzle.split(",");

  const initialBoardsFromBackend = [];

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

  // 초기 보드를 useState로 설정
  const [boards, setBoards] = useState(initialBoardsFromBackend);
  const handleDrop = (boardIndex, pictureId) => {
    sendLogData(boardIndex, pictureId);
    if (boards[boardIndex].fixed) return; // 고정된 칸은 드롭 무시

    const picture = PictureList.find((p) => p.id === pictureId);
    setBoards((prevBoards) => {
      const newBoards = [...prevBoards];
      newBoards[boardIndex] = { ...picture, fixed: false }; // 고정되지 않은 이미지
      return newBoards;
    });
  };

  const handleSendAnswerCheck = () => {
    console.log(boards);
    console.log(locationArray);
    const userAnswerString = getUserAnswerString(boards, locationArray);

    sendPuzzleAnswer(userAnswerString);
  };

  const getUserAnswerString = (boards, location) => {
    const locationArray = Array.from(String(location), Number);

    // const result = boards.filter((_, index) => locationArray.includes(index + 1)).map((board) => board.id);
    // console.log(result);
    // return result;

    console.log(locationArray);

    const result = boards
      .map((board, index) => {
        if (!locationArray.includes(index + 1)) {
          return `${index + 1}:${board.id}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
    console.log(result);
    return result;
  };

  // 게임로그 publisher
  const sendLogData = async (logLocation, logNum) => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!num 확인하기
      const message = {
        userId: userId,
        message: `${userId}번님이 ${logLocation}위치에 ${logNum}을 넣었습니다`,
        rtcSession: sessionId,
      };

      client.send("/pub/puzzle/log", {}, JSON.stringify(message));
      console.log(message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  // 게임정답제출 publisher
  const sendPuzzleAnswer = async (userAnswerString) => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }
      // userAnswerString!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!이걸 만드는 그개 필요해
      const message = {
        rtcSession: sessionId,
        userId: userId,
        userAnswer: userAnswerString,
        check: 1,
      };

      client.send("/pub/puzzle/data", {}, JSON.stringify(message));
      console.log(message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };
  const PictureList = [];
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
      const id = i * 10 + j;
      const key = i * 10 + j;
      const url = `/image/game/puzzleGame/puzzlePiece/${id}.png`;
      PictureList.push({ id, url });
    }
  }

  return (
    <div className={style.compStyle}>
      <div className={style.container}>
        <div className={style.puzzleLeft}>
          {/* <div className="Boards"> */}
          {/* {boards.map((picture, index) => (
            <Board
              key={index}
              index={index}
              picture={picture}
              onDrop={handleDrop}
              className={`board-${index}`}
            />
          ))} */}
          {/* </div> */}
          <div className={style.board0}>
            <Board key={0} index={0} picture={boards[0]} onDrop={handleDrop} />
          </div>
          <div className={style.board1}>
            <Board key={1} index={1} picture={boards[1]} onDrop={handleDrop} />
          </div>
          <div className={style.board2}>
            <Board key={2} index={2} picture={boards[2]} onDrop={handleDrop} />
          </div>
          <div className={style.board3}>
            <Board key={3} index={3} picture={boards[3]} onDrop={handleDrop} />
          </div>
          <div className={style.board4}>
            <Board key={4} index={4} picture={boards[4]} onDrop={handleDrop} />
          </div>
          <div className={style.board5}>
            <Board key={5} index={5} picture={boards[5]} onDrop={handleDrop} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <button
            className={style.stage3SelectBtn}
            onClick={handleSendAnswerCheck}
          >
            정답 확인
          </button>
        </div>

        <div className={style.puzzleRight}>
          {PictureList.map((picture) => (
            <div
              className="Picture"
              // style={{
              //   display: "grid",
              //   gridTemplateColumns: "repeat(1, 1fr)", // 하나의 열을 생성
              //   gridTemplateRows: "repeat(1, 1fr)", // 하나의 행을 생성
              //   gap: "10px", // 각 그리드 항목 사이의 간격
              //   width: "16.66%", // 전체 너비를 6으로 나눔 (6x6 그리드)
              //   float: "left", // 혹은 flex를 사용할 수 있습니다.
              // }}
            >
              <Picture key={picture.id} url={picture.url} id={picture.id} />
            </div>
          ))}
        </div>

      </div>
      {/* <div className={style.stage3SelectBtn} onClick={props.changeIsClear}>
        선택완료
      </div> */}
    </div>
  );
};
export default PuzzleTwm;
