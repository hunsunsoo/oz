import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = new Date().getTime();

    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      setElapsedTime(elapsedSeconds);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
  };

  const clockStyle = {
    backgroundColor: '#ADC178',
    height: '80%',
    width: '145px',
    color: 'black',
    fontSize: '40px',
    marginLeft: '31%',
    padding: '0 30px', // 좌우 여백 추가
    borderRadius: '20px', // 모서리를 둥글게 하는 속성
  };

  return <div style={clockStyle}>{formatTime(elapsedTime)}</div>;
};

export default Clock;
