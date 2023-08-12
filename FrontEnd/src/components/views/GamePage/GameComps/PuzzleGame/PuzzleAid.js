import React, { useState, useEffect } from "react";
import style from "./PuzzleAid.module.css";

const PictureList = [];
for (let i = 1; i <= 6; i++) {
  for (let j = 1; j <= 6; j++) {
    const id = i * 10 + j;
    const url = `/image/game/puzzleGame/puzzlePiece/${id}.png`;
    PictureList.push({ id, url });
  }
}

function BoardItem({ data }) {
  return (
    <div className={style.boardItem}>
      {data ? (
        <img
          src={data.url}
          alt={`piece-${data.id}`}
          style={{ width: "40px" }}
        />
      ) : (
        <div className={style.emptySpace} />
      )}
    </div>
  );
}

const PuzzleAid = ({ startData, myRole }) => {
  const [board, setBoard] = useState([
    { id: null, url: null },
    { id: null, url: null },
  ]);

  console.log(startData);
  const location = startData.location;
  const puzzle = startData.puzzle;

  useEffect(() => {
    // 백엔드에서 데이터 가져오는 곳 로케이션은 위치 퍼즐은 그림

    const locations = Array.from(String(location), Number);
    const imageIds = puzzle.split(",");
    const newBoard = Array(6).fill(null); // 6개의 원소를 가진 배열을 null로 초기화

    locations.forEach((location, index) => {
      const adjustedLocation = location - 1; // 위치 값을 1씩 줄임
      if (imageIds[index] === "null") {
        newBoard[adjustedLocation] = null;
        console.log(index);
      } else {
        newBoard[adjustedLocation] = {
          id: parseInt(imageIds[index]),
          url: `/image/game/puzzleGame/puzzlePiece/${imageIds[index]}.png`,
        };
      }
    });
    setBoard(newBoard); // 새로운 board 상태 설정
  }, []);

  return (
    <>
      {myRole === 1 ? (
        // <div className={style.container}>
        <div className={style.boardContainer1}>
          <div className={style["board1"]}>
            <BoardItem data={board[0]} />
          </div>
          <div className={style["board2"]}>
            <BoardItem data={board[1]} />
          </div>
        </div>
      ) : myRole === 2 ? (
        <div className={style.boardContainer2}>
          <div className={style["board-container3"]}>
            <BoardItem data={board[2]} />
          </div>
          <div className={style["board-container4"]}>
            <BoardItem data={board[3]} />
          </div>
        </div>
      ) : (
        <div className={style.boardContainer3}>
          <div className={style["board-container5"]}>
            <BoardItem data={board[4]} />
          </div>
          <div className={style["board-container6"]}>
            <BoardItem data={board[5]} />
          </div>
        </div>
      )}
      {/* </div> */}
    </>
  );
};
export default PuzzleAid;
