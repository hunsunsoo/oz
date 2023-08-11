import React, { useState, useEffect } from 'react';
import {MiroRed, MiroGreen, MiroBlue} from "./TrapBoard";
const TrapAid = ({ startData, myRole }) => {

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
  

  return(
    <div>
      여긴 조력자의 페이지야
      {miroColorRendering}
    </div>
  );
};

export default TrapAid;