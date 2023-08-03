import React, { useState } from "react";

const WaitingRoomOption = ({ isWaiting, onGamingStart }) => {

  const handleGamingStartState = () => {
    const newStatus = !isWaiting
    onGamingStart(newStatus);
  };

  const WROStyle = {
    backgroundColor: "#CABE96",
    height: "20%",
    display: "flex",
  };

  const leftPaneStyle = {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const rightPaneStyle = {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "30px",
    backgroundColor: "#6C584C",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    margin: "10px",
  };

  return (
    <div style={WROStyle}>
      <div style={leftPaneStyle}>
        {/* Left Pane Content */}
        <button style={buttonStyle}>친구 초대하기</button>
      </div>
      <div style={rightPaneStyle}>
        {/* Right Pane Content */}
        <button style={buttonStyle} onClick={handleGamingStartState}>
          모험시작
        </button>
        <button style={buttonStyle}>나가기</button>
      </div>
    </div>
  );
};

export default WaitingRoomOption;
