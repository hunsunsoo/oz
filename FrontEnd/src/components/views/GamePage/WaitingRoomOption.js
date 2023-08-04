import React, { useState } from "react";
import style from "./WaitingRoomOption.module.css";

const WaitingRoomOption = ({ isWaiting, onGamingStart }) => {

  const handleGamingStartState = () => {
    const newStatus = !isWaiting
    onGamingStart(newStatus);
  };

  const WROStyle = {
    backgroundColor: "rgb(221, 229, 182)",
    height: "20%",
    display: "flex",
  };

  return (
    <div style={WROStyle}>
      <div className={style.optionBox}>
        {/* Left Pane Content */}
        <button className={style.optionButton}><i class="fi fi-rr-microphone"></i></button>
        <button className={style.optionButton}><i class="fi fi-rr-video-camera-alt"></i></button>
        <button className={style.optionButton}><i class="fi fi-rr-settings"></i></button>
        <button className={style.optionButton}><i class="fi fi-rr-envelope-plus"></i></button>
      </div>
      <div className={style.nextBox}>
        {/* Right Pane Content */}
        <button className={style.nextButton} onClick={handleGamingStartState}>
          모험시작
        </button>
        <button className={style.nextButton}>나가기</button>
      </div>
    </div>
  );
};

export default WaitingRoomOption;
