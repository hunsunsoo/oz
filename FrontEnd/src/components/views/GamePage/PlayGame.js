import React from 'react';
import { GameComp_1_11, GameComp_1_12, GameComp_1_13, GameComp_2_11, GameComp_2_12 } from './GameComps/GameComps';

const GamePlayPage = () => {
  const isStage = 2;
  const isIndex = 12;
    
  let componentToRender;

  switch (isStage) {
    case 0: // 이게 스테이지 구분 (0-1)
      switch (isIndex) { // 이게 인덱스 구분
        case 1: 
          componentToRender = null;
          break;
        case 2:
          componentToRender = null;
          break;
        case 3:
          componentToRender = null;
          break; 
      }
      break;
    case 1: // 이게 스테이지 구분 (1-1)
      switch (isIndex) { // 이게 인덱스 구분
        case 1: 
          componentToRender = null;
          break;
        case 2:
          componentToRender = null;
          break;
        case 3:
          componentToRender = null;
          break;
        case 11: 
          componentToRender = <GameComp_1_11 />;
          break;
        case 12:
          componentToRender = <GameComp_1_12 />;
          break;
        case 13:
          componentToRender = <GameComp_1_13 />;
          break; 
      }
      break;
    case 2: // 이게 스테이지 구분 (2-1)
      switch (isIndex) { // 이게 인덱스 구분
        case 1: 
          componentToRender = null;
          break;
        case 2:
          componentToRender = null;
          break;
        case 3:
          componentToRender = null;
          break;
        case 11: 
          componentToRender = <GameComp_2_11 />;
          break;
        case 12:
          componentToRender = <GameComp_2_12 />;
          break;
        case 13:
          componentToRender = null;
          break; 
      }
      break;
  }

  const bodyStyle = { // body 부분 (배경색상용)
    width: "100%",
    height: "60%",
    backgroundColor: "#DDE5B6"
  }

  return (
      <div style={bodyStyle}>
        {componentToRender}
      </div>
  );
};

export default GamePlayPage;

  