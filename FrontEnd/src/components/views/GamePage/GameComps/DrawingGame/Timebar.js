// react
import React, { useRef, useEffect, useState } from "react";
// 시간을 막대 형태로 렌더링해 주는 라이브러리
import ProgressBar from "@ramonak/react-progress-bar";

export default function TimeBar({ client, sessionId, myUserId, myRole, currentRole, duration }) {
    const [timeLeft, setTimeLeft] = useState(duration); // 초 단위로 남은 시간을 저장
    const [progress, setProgress] = useState(100); // 프로그레스 바의 진행 상태
    // const [runCount, setRunCount] = useState(0); // 추가한 상태 변수

    useEffect(() => {
      setTimeLeft(duration);
      const interval_id = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 0) {
            clearInterval(interval_id);

            if(currentRole === myRole && duration === 7){
                const message = {
                  rtcSession: sessionId,
                  userId: myUserId,
                  currentRole: currentRole,
                  png: null
                };
                console.log("Send message: " + message);
                client.send(`/pub/draw/pass`, {}, JSON.stringify(message));
            }

            return duration;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
  
      console.log(timeLeft)
      return () => {
        clearInterval(interval_id);
      };
    }, [duration]);
  
    useEffect(() => {
      setProgress((timeLeft / duration) * 100);
    }, [timeLeft, duration]);
  
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