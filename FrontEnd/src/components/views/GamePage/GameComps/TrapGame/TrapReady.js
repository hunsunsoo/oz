import React, { useState, useEffect } from 'react';


const TrapReady = ({ onHandleStart }) => {



  return(
    <div>
      <button onClick={onHandleStart}>게임 시작</button>
    </div>
  );
};

export default TrapReady;