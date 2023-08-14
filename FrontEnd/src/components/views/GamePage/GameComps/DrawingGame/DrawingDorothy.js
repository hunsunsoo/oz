import React, { useRef, useEffect, useState } from "react";
import Canvas from "./canvas";
// style
import style from "./DrawingDorothy.module.css";


export default function DrawingDorothy({client, sessionId, myUserId, myRole, currentRole}) {
    const [showDiv, setShowDiv] = useState(true);
    const [role, setRole] = useState("");
    const [answer, setAnswer] = useState("");

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

        if (currentRole === 5) {
          setShowDiv(false);
        }else{
            setShowDiv(true);
        }
    }, [currentRole]);

    const onAnswerHandler = (event) => setAnswer(event.currentTarget.value);

    const drawingGameAnswerPublisher = async () => {
        if(answer === ""){
            alert("답을 입력해 주세요");
            return;
        }
        try {
          if (!client) {
            console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
            return;
          }
              
          const message = {
            "rtcSession": sessionId,
            "userId": myUserId,
            "userAnswer": answer
          };

          console.log(message);
          client.send('/pub/draw/data', {}, JSON.stringify(message));
        } catch (error) {
          console.log('Error sending message:', error);
        }
    };

    const enterKeyPress = (event) => {
        if (event.key === "Enter") {
          drawingGameAnswerPublisher();
        }
      };

    return (
        <div>
            <div className={style.answerZone}>
                <input className={style.answerInput}
                type="text"
                value={answer}
                placeholder="정답을 입력하세요"
                onChange={onAnswerHandler}
                onKeyDown={enterKeyPress}
                disabled={currentRole !== 5}/>
                {!showDiv &&
                <button className={style.answerButton}
                onClick={drawingGameAnswerPublisher}>
                    제출
                </button>}
            </div>
            <Canvas client={client} sessionId={sessionId} myUserId={myUserId} myRole={myRole} currentRole={currentRole}></Canvas>
            {showDiv && <div className={style.hideZone}>{role} 님이 그리는 중입니다</div>}
        </div>
    )
}