// react
import React, { useRef, useEffect, useState } from "react";
import Canvas from "./canvas";
import style from "./DrawingAid.module.css";
import GameModal from "../GameModal/GameModal";

export default function DrawingAid({client, sessionId, myUserId, myRole, currentRole, keyword}) {
    const [showDiv, setShowDiv] = useState(false);
    const [role, setRole] = useState("");
    const [currentKeyword, setKeyword] = useState("");

    useEffect(() => {
      setKeyword(keyword);
      console.log(keyword + ": " + currentKeyword);
    }, [keyword]);

    useEffect(() => {
        switch(currentRole){
            case 2:
                setRole("사자");
                break;
            case 3:
                setRole("허수아비");
                break;
            case 4:
                setRole("양철 나무꾼");
                break;
            case 5:
                setRole("도로시");
                break;
        }

        if (currentRole !== 5) {
          if(currentRole == myRole){
            setShowDiv(true); // div 표시
            const timer = setTimeout(() => {
              setShowDiv(false); // div 숨김
            }, 3000);
      
            return () => {
              clearTimeout(timer);
            };
          }
        }
    }, [currentRole]);
    const stageval = 4;
    const [showModal, setShowModal] = useState(false);
    const onHandleExplain = () => {
      setShowModal(true);
    };

  return (
    <div className={style.compStyle}>
      <div className={style.background_G4}>
        <div className={style.keyWordDiv}>{currentKeyword}</div>
        <div className={style.turnDiv}>{role}의 차례입니다</div>
        <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
            onClick={onHandleExplain}
          />
           {showModal && (
          <GameModal
            isStage={stageval}
            closeModal={() => setShowModal(false)}
          />
        )}
        <Canvas client={client} sessionId={sessionId} myRole={myRole} myUserId={myUserId} currentRole={currentRole} sendDuration={showDiv}></Canvas>
        {showDiv && <div className={style.readyDiv}>준비</div>}        
      </div>
    </div>
    
  )
}