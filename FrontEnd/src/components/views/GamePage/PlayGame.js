import React, { useState, useEffect } from "react";
import { GameComp } from "./GameComps/GameComps";

const PlayGame = () => {
  const [isStage, setIsStage] = useState(0);
  const [isIndex, setIsIndex] = useState(0);
  const stageLimits = [16, 11, 12, 11, 7, 14];

  const handleNext = () => {
    if (isIndex < stageLimits[isStage]) {
      setIsIndex(isIndex + 1);
    } else {
      setIsIndex(0);
      setIsStage(isStage + 1);
    }
  };
  const isButtonActive = isStage >= 1 && isStage <= 4 && isIndex >= 11 && isIndex <= 20;

  const indexNext = () => {
    setIsIndex(isIndex + 1);
  };

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

  return (
    <div style={gamedivStyle}>
      <div style={bodyStyle}>
        <button style={BtnStyle} onClick={handleNext} >Next</button>
        <GameComp isStage={isStage} isIndex={isIndex} changeIsIndex={indexNext} />
      </div>
    </div>
  );
};

export default PlayGame;
