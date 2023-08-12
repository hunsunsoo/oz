// react
import React, { useRef, useEffect, useState } from "react";
// 시간을 막대 형태로 렌더링해 주는 라이브러리
import ProgressBar from "@ramonak/react-progress-bar";
// style
import style from "./test.module.css";
// import { current } from "@reduxjs/toolkit";

function TimeBar({ duration, onRoleChange }) {
  const [timeLeft, setTimeLeft] = useState(duration); // 초 단위로 남은 시간을 저장
  const [progress, setProgress] = useState(100); // 프로그레스 바의 진행 상태
  const [runCount, setRunCount] = useState(0); // 추가한 상태 변수
  useEffect(() => {
    if (runCount >= 3) return; // 3번 이상 실행되었다면 종료

    const interval_id = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 0) {
          clearInterval(interval_id);
          setRunCount((prevRunCount) => prevRunCount + 1); 
          return duration;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval_id);
    };
  }, [duration, runCount]);

  useEffect(() => {
    setProgress((timeLeft / duration) * 100);
  }, [timeLeft, duration]);

  useEffect(() => {
    if(runCount === 1) onRoleChange(3);
    else if(runCount === 2) onRoleChange(4);
  }, [runCount, onRoleChange]);

  return (
    <ProgressBar
      completed={progress}
      width="100%"
      height="100%"
      bgColor="#6c584c"
      baseBgColor="#f0ead2"
      borderRadius="7px"
      dir="rtl"
      isReversed={true}
      ariaValuemax={100}
      ariaValuemin={0}
      isLabelVisible={false}
    />
  );
}

export default function App({client, sessionId}) {
  // useRef
  const canvasRef = useRef(null);
  // getCtx
  const [getCtx, setGetCtx] = useState(null);
  // painting state
  const [painting, setPainting] = useState(false);
  const [currentRole, setCurrentRole] = useState(1);
  const userRole = 1;

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
  };

  useEffect(() => {
    // canvas useRef
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    canvas.height = window.innerHeight * 0.43;
    canvas.width = window.innerWidth * 0.4;


    ctx.fillStyle = "#f0ead2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#6C584C";
    setGetCtx(ctx);
  }, []);

  
  const penEvent = () =>{
    // if(currentRole === userRole){
      getCtx.strokeStyle = "#6C584C";
      getCtx.lineWidth = 2.5;
    // }
  };

  const eraseEvent = () =>{
    // if(currentRole === userRole){
      getCtx.strokeStyle = "#f0ead2";
      getCtx.lineWidth = 25;
    // }
  }

  const broomEvent = () =>{
    // if(currentRole === userRole){
      getCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // }
  }

  useEffect(() => {
    console.log(client)
    const subscription = client.subscribe(`/sub/socket/draw/${sessionId}`, (message) => {
      const receivedData = JSON.parse(message.body);

      if (receivedData.type === 'draw' && receivedData.rtcSession === sessionId) {
        console.log("@@@@@@@@@@@@@@@")
        const { x, y, width, color, paint } = receivedData.data;
        getCtx.strokeStyle = color;
        getCtx.lineWidth = width;
        if(!paint){
          getCtx.beginPath();
          getCtx.moveTo(x, y);
        }else{
          getCtx.lineTo(x, y);
          getCtx.stroke();
        }        
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, sessionId]);

  const drawFn = e => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    // if(currentRole === userRole){
      if (!painting) {
          // getCtx.beginPath();
          // getCtx.moveTo(mouseX, mouseY);
          const drawingInfo = {
            sessionId: sessionId,
            x: mouseX,
            y: mouseY,
            width: getCtx.lineWidth,
            color: getCtx.strokeStyle,
            paint: false
        };
        client.send(`/pub/socket/draw`, {}, JSON.stringify(drawingInfo));
      } else {
          // getCtx.lineTo(mouseX, mouseY);
          // getCtx.stroke();

          const drawingInfo = {
              sessionId: sessionId,
              x: mouseX,
              y: mouseY,
              width: getCtx.lineWidth,
              color: getCtx.strokeStyle,
              paint: true
          };

          client.send(`/pub/socket/draw`, {}, JSON.stringify(drawingInfo));
      }

      
    // }
  }

  return (
      <div className={style.canvasWrap}>
        <div className={style.timer}>
          <div className={style.clock}>⏳</div>
          <div className={style.timebarVertical}><TimeBar duration={7} onRoleChange={handleRoleChange}></TimeBar></div>
        </div>
        <div className = {style.buttonZone}>
          <button className = {style.button} onClick={penEvent}>
            <i class="fi fi-rr-pen-fancy"></i>
          </button>
          <button className = {style.button} onClick={eraseEvent}>
            <i class="fi fi-rr-eraser"></i>
          </button>
          <button className = {style.button} onClick={broomEvent}>
            <i class="fi fi-rr-broom"></i>
          </button>
        </div>
        <canvas 
          className={style.canvas}
          ref={canvasRef}
          onMouseDown={() => setPainting(true)}
          onMouseUp={() => setPainting(false)}
          onMouseMove={e => drawFn(e)}
          onMouseLeave={() => setPainting(false)}
        >
        </canvas>
      </div>
  )
}