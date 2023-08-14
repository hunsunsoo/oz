// react
import React, { useRef, useEffect, useState } from "react";
import style from "./canvas.module.css";
import TimeBar from "./Timebar";


const Canvas = ({client, sessionId, myUserId, myRole, currentRole, sendDuration}) => {
    // useRef
  const canvasRef = useRef(null);
  // getCtx
  const [getCtx, setGetCtx] = useState();
  // painting state
  const [painting, setPainting] = useState(false);
  const [timeBarDuration, setTimeBarDuration] = useState(0);
  const [paintAvailable, setPaintAvailable] = useState(false);


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
    console.log(ctx);
    setGetCtx(ctx);
  }, []);

  useEffect(() => {
    console.log(client)
    const subscription = client.subscribe(`/sub/socket/draw/drawing/${sessionId}`, (message) => {      
      //console.log("Received message:", message.body);

      try{
        const receivedData = JSON.parse(message.body);
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
      } catch (error) {
        console.error("Error parsing message body:", error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, sessionId, getCtx]);

  useEffect(() => {
    console.log(client)
    const subscription = client.subscribe(`/sub/socket/draw/reset/${sessionId}`, (message) => {      
      console.log("Received message:", message.body);
      
      try{
        getCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      } catch (error) {
        console.error("Error parsing message body:", error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [client, sessionId, getCtx]);

  useEffect(() => {
    setPaintAvailable(!sendDuration);
    if(!sendDuration){
      setTimeBarDuration(7);
    }else{
      setTimeBarDuration(0);
    }
  }, [sendDuration]);

  
  const penEvent = () =>{
    if(currentRole === myRole && paintAvailable){
      getCtx.strokeStyle = "#6C584C";
      getCtx.lineWidth = 2.5;
    }
  };

  const eraseEvent = () =>{
    if(currentRole === myRole && paintAvailable){
      getCtx.strokeStyle = "#f0ead2";
      getCtx.lineWidth = 25;
    }
  }

  const broomEvent = () =>{
    if(currentRole === myRole && paintAvailable){
      const sendData = {
        rtcSession: sessionId,
        userId: myUserId
      };

      client.send(`/pub/draw/reset`, {}, JSON.stringify(sendData));
    }
  }

  const drawFn = e => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if(currentRole === myRole && paintAvailable){
      const drawingInfo = {
        sessionId: sessionId,
        userId: myUserId,
        x: mouseX,
        y: mouseY,
        width: getCtx.lineWidth,
        color: getCtx.strokeStyle,
        paint: painting
      };
      client.send(`/pub/draw/drawing`, {}, JSON.stringify(drawingInfo));
    }
  }

    return (
      <div className={style.canvasWrap}>
        {myRole !== 1 && (
        <div className={style.timer}>
          <div className={style.clock}>⏳</div>
          <div className={style.timebarVertical}><TimeBar client={client} sessionId={sessionId} myUserId={myUserId} myRole={myRole} currentRole={currentRole} duration={timeBarDuration}></TimeBar></div>
        </div>
        )}
        {myRole !== 1 && (
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
        )}
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
    );
}

export default Canvas;