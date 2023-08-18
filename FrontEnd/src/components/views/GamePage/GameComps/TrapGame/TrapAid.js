import React, { useState, useEffect } from 'react';
import {MiroRed, MiroGreen, MiroBlue} from "./TrapBoard";
import style from "./TrapAid.module.css"
import GameModal from "../GameModal/GameModal";
import CustomAlert from '../Alert/alert';
const TrapAid = ({ startData, myRole }) => {
  const stageval = 2
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const mapData = startData.data.aidMap;
  // 공백을 기준으로 문자열을 숫자 배열로 변환
  const numberArray = mapData.split(" ").map(Number);

  // 원하는 행과 열의 개수
  const rows = 6;
  const cols = 6;

  const boardData = [];
  for (let i = 0; i < rows; i++) {
    const row = numberArray.slice(i * cols, (i + 1) * cols);
    boardData.push(row);
  }
  
  // 역할에 따른 게임페이지 조건부 렌더링
  let miroColorRendering;
  switch (myRole) {
    case 1:
      miroColorRendering = < MiroRed boardData={boardData} />
      break;
    case 3:
      miroColorRendering = < MiroGreen boardData={boardData} />
      break;
    case 4:
      miroColorRendering = < MiroBlue boardData={boardData} />
      break;
  }
  const onHandleExplain = () => {
    setShowModal(true);
  };

  return(
    <div className={style.compStyle}>
      <div className={style.backgroundDiv}>
        {myRole === 1 ? (
          <div className={style.miroHow}>
            <div>
              <div className={style.miroText}>출발</div>
              <div className={style.miroText}>도착</div>
            </div>
            <div>
              <img src="image/game/trapGame/start.png" className={style.PicStyle} />
              <img src="image/game/trapGame/finish.png" className={style.PicStyle} />
            </div>       
          </div>
        ) : myRole === 3 ? (
          <div className={style.miroHow}>
            <div>
              <div className={style.miroText}>폭탄</div>
            </div>
            <div>
              <img src="image/game/trapGame/bomb.png" className={style.PicStyle} />
            </div>       
          </div>
        ) : (
          <div className={style.miroHow}>
            <div>
              <div className={style.miroText}>유령</div>
            </div>
            <div>
              <img src="image/game/trapGame/ghost.png" className={style.PicStyle} />
            </div>       
          </div>
        )}
        <div className={style.miroDiv}>
          {miroColorRendering}
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

export default TrapAid;