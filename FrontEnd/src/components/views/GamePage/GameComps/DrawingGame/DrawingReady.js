import React, { useState, useEffect } from 'react';

const DrawingReady = ({onHandleStart}) => {
  const handleStartAfterReady = () => {
    onHandleStart(true);
  };

  const button = {
    width: "20%",
    height: "20%",
    backgroundColor: "#DDE5B6",
    cursor: "pointer",
  };


  return(
    <div style={button} onClick={handleStartAfterReady}>
        게임 시작
    </div>
  );
};

export default DrawingReady;