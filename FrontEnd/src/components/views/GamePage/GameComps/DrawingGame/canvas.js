// react
import React, { useRef, useEffect, useState } from "react";
import style from "./canvas.module.css";

function Canvas() {
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
    if(currentRole === userRole){
      getCtx.strokeStyle = "#6C584C";
      getCtx.lineWidth = 2.5;
    }
  };

  const eraseEvent = () =>{
    if(currentRole === userRole){
      getCtx.strokeStyle = "#f0ead2";
      getCtx.lineWidth = 25;
    }
  }

  const broomEvent = () =>{
    if(currentRole === userRole){
      getCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }

  const drawFn = e => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if(currentRole === userRole){
      if (!painting) {
          getCtx.beginPath();
          getCtx.moveTo(mouseX, mouseY);
      } else {
          getCtx.lineTo(mouseX, mouseY);
          getCtx.stroke();
      }
    }
  }

    return (
        <canvas 
          className={style.canvas}
          ref={canvasRef}
          onMouseDown={() => setPainting(true)}
          onMouseUp={() => setPainting(false)}
          onMouseMove={e => drawFn(e)}
          onMouseLeave={() => setPainting(false)}
        >
        </canvas>
    );
}