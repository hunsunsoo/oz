// react
import React, { useRef, useEffect, useState } from "react";
// style
import style from "./test.module.css";

export default function App() {
  // useRef
  const canvasRef = useRef(null);
  // getCtx
  const [getCtx, setGetCtx] = useState(null);
  // painting state
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    // canvas useRef
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#6C584C";
    setGetCtx(ctx);
  }, []);

  const drawFn = e => {
    // mouse position
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    // drawing
    if (!painting) {
      getCtx.beginPath();
      getCtx.moveTo(mouseX, mouseY);
    } else {
      getCtx.lineTo(mouseX, mouseY);
      getCtx.stroke();
    }
  }

  return (
      <div className={style.canvasWrap}>
        <div className = {style.buttonZone}>

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