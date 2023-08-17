import React, { useState, useEffect } from "react";
import { NumberBoard, AlphaBoardH, MathBoardH, AnsBoard } from "./CalBoard";
import style from "./Calculation.module.css";
import GameModal from "../GameModal/GameModal";
const CalculationHeosu = ({ boardData, myRole, client, sessionId, roundId, resAnswer, onHandleActorState, actorState, tableData, onHandleTableData, head, onHandleresetTable, failTimeOut, onHandleMike, onHandleCamera, onHandleSpeaker }) => {
	
	useEffect(() => {
		// 10초 후에 숫자판
		if (actorState === 0) {
			const timeoutId = setTimeout(() => {
				onHandleActorState(1);
				onHandleMike(false);
				onHandleSpeaker(false);
			}, 10000);

			return () => clearTimeout(timeoutId);
		}
  }, [actorState]);
  const stageval = 1;
  const [showModal, setShowModal] = useState(false);
  const onHandleExplain = () => {
    setShowModal(true);
  };
  const staticBoardData = [
    ["A", "B", "C", "D", "E", "F"],
    ["G", "H", "I", "J", "K", "L"],
    ["M", "N", "O", "P", "Q", "R"],
    ["S", "T", "U", "V", "W", "X"],
    ["Y", "Z", "a", "b", "c", "d"],
    ["e", "f", "g", "h", "i", "j"],
  ];

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCellClick = (row, col) => {
    onHandleTableData(staticBoardData[row][col]);
  };

  const handleCellClick2 = (cell) => {
    onHandleTableData(cell);
  };

  const handleReset = () => {
    onHandleresetTable();
  };

  const submitAnswer = () => {
    const nums = [];
    const marks = [];
    nums.push(tableData[0][0]);
    nums.push(tableData[0][2]);
    nums.push(tableData[0][4]);

    marks.push(tableData[0][1]);
    marks.push(tableData[0][3]);

    sendStage1SelectAns(nums, marks);
  };

  // 1스테이지 정답 선택 pub
  const sendStage1SelectAns = async (nums, marks) => {
    console.log("허수아비 정답제출 누름");
    // /pub/calculation/submitanswer/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }

      const message = {
        selectedNums: nums,
        marks: marks,
      };

      client.send(
        `/pub/calculation/submitanswer/${roundId}`,
        {},
        JSON.stringify(message)
      );
      console.log("조력자 선택완료 누름 -> 넘어감");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  

  if (actorState === 0) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.juseokbalance}>
            <div className={style.juseok}>숫자판을 외워봐~!</div>
          </div>
          <div className={style.BoardStyle}>
            <NumberBoard boardData={boardData} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
            onClick={onHandleExplain}
          />
        </div>
      </div>
    );
  } else if (actorState === 1) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.juseokbalance}>
            <div className={style.juseok}>친구들이 곧 힌트를 줄거야!</div>
          </div>

          <div className={style.BoardStyle2}>
            <AlphaBoardH
              onHandleCellClick={handleCellClick}
              boardData={staticBoardData}
              client={client}
              roundId={roundId}
              head={head}
              myRole={myRole}
            />
          </div>
          <div className={style.MathBoardStyle}>
            <MathBoardH onHandleCellClick={handleCellClick2} head={head} />
          </div>
          <div className={style.AnsBoardStyle}>
            <AnsBoard tableData={tableData} head={head} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <div className={style.ansSubmitBtn} onClick={submitAnswer}>
            정답제출
          </div>
          <div className={style.resetBtn} onClick={handleReset}>
            리셋
          </div>
          <img
            src="image/tools/equal.png"
            alt="equal"
            className={style.equal}
          />
          <div className={style.rectangleStyle}>{resAnswer}</div>
        </div>
      </div>
    );
  } else if (actorState === 2) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.juseokbalance}>
            <div className={style.juseok}>
              친구들이 힌트를 줬어! 얼른 수식을 완성해보자!
            </div>
          </div>

          <div className={`${style.BoardStyle2} ${
              [0, 2, 4].includes(head) ? style.head024Style : null
            }`}>
            <AlphaBoardH
              onHandleCellClick={handleCellClick}
              boardData={boardData}
              client={client}
              roundId={roundId}
              head={head}
            />
          </div>
          <div
            className={`${style.MathBoardStyle} ${
              [1, 3].includes(head) ? style.head13Style : null
            }`}
          >
            <MathBoardH onHandleCellClick={handleCellClick2} head={head} />
          </div>
          <div className={style.AnsBoardStyle}>
            <AnsBoard tableData={tableData} head={head} />
          </div>

          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
            onClick={onHandleExplain}
          />
          <div className={style.ansSubmitBtn} onClick={submitAnswer} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}> 
            정답제출
          </div>
          <div className={style.resetBtn} onClick={handleReset} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            리셋
          </div>
          <img
            src="image/tools/equal.png"
            alt="equal"
            className={style.equal}
          />
          <div className={style.rectangleStyle}>{resAnswer}</div>
        </div>
        {showModal && (
          <GameModal
            isStage={stageval}
            closeModal={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }
};

export default CalculationHeosu;
