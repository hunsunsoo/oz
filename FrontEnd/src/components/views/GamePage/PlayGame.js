import React, { useState, useEffect } from "react";
import { GameComp } from "./GameComps/GameComps";

const PlayGame = () => {
  const [isStage, setIsStage] = useState(0);
  const [isIndex, setIsIndex] = useState(0);
  const stageLimits = [16, 4, 12, 11, 7, 14];

  // flow 상의 Next 버튼
  const handleNext = () => {
    if (isIndex < stageLimits[isStage]) {
      setIsIndex(isIndex + 1);
    } else if (isIndex == 21) {
      setIsIndex(0);
      setIsStage(isStage + 1);
    } else {
      setIsIndex(0);
      setIsStage(isStage + 1);
    }
  };
  const isButtonActive = isStage >= 1 && isStage <= 4 && isIndex >= 11 && isIndex <= 20;

  // index만 증가 따로
  const indexNext = () => {
    setIsIndex(isIndex + 1);
  };

  // stage별 이동 따로
  const stageNext = () => {
    setIsIndex(0);
    setIsStage(isStage + 1);
  };

  // 게임 시작 (준비완료 됐을때)
  const readyNext = () => {
    setIsIndex(11);
  }

  // 게임 클리어 (마지막 일러스트 보러가자)
  const stageLast = () => {
    if (isStage == 4 ){
      setIsIndex(0);
      setIsStage(isStage + 1);
    } else {
      setIsIndex(21);
    }
  }

  useEffect(() => {
    // 10초 후에 숫자판 (일단 3초)
    if (isStage === 1 && isIndex === 11) {
      const timeoutId = setTimeout(() => {
        setIsIndex(isIndex + 1);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [isStage, isIndex]);

  const gamedivStyle = {
    margin: "0",
    padding: "0",
    height: "60%",
    overflow: "hidden",
  };

  const bodyStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "#DDE5B6",
  };

  const BtnStyle = {
    position: "absolute",
    // display: isButtonActive ? "none" : "block",
  }

  console.log("stage: "+isStage+" index: "+isIndex);
  return (
    <div style={gamedivStyle}>
      <div style={bodyStyle}>
        <button style={BtnStyle} onClick={handleNext} >Next</button>
        <GameComp isStage={isStage} isIndex={isIndex} changeIsIndex={indexNext} changeIsStage={stageNext} changeIsReady={readyNext} changeIsClear={stageLast}/>
      </div>
    </div>
  );
};

export default PlayGame;
