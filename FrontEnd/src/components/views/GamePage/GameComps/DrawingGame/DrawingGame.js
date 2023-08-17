import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import style from "./DrawingGame.module.css";
import DrawingReady from "./DrawingReady";
import DrawingDorothy from "./DrawingDorothy";
import DrawingAid from "./DrawingAid";

const DrawingGame = ({
  client,
  sessionId,
  myRole,
  handleindexSet,
  R1,
  R2,
  R3,
  R4,
  onHandleMike, onHandleCamera, onHandleSpeaker,
}) => {
  const [isStart, setIsStart] = useState(false);

  const [isClear, setIsClear] = useState(false);
  const [isFail, setIsFail] = useState(false);

  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );
  var base64Url = accessToken.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jwtPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  const JsonPayload = JSON.parse(jwtPayload);
  const [myUserId, setuserId] = useState(JsonPayload.userId);

  const [keyword, setKeyword] = useState("");
  const [currentRole, setCurrentRole] = useState(2);

  // 하위 컴포넌트에서 현재 컴포넌트의 state를 바꿀 수 있게 해주는 handler
  const handleGamingStart = (status) => {
    setIsStart(status);
  };

  useEffect(() => {
    const subscribeToWaiting = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("이어그리기 게임 시작 구독 연결 실패");
        }
        console.log("이어그리기 게임 시작 구독 연결중");
        const subscription = client.subscribe(
          `/sub/socket/draw/start/${myRole}/${sessionId}`,
          (message) => {
            console.log("Received message:", message.body);

            try {
              const resJsondata = JSON.parse(message.body);
              setKeyword(resJsondata.data);
              console.log("userId: " + myUserId);
              onHandleMike(false);
              onHandleSpeaker(false);
              setCurrentRole(2);
              handleGamingStart(true);
            } catch (error) {
              console.error("Error parsing message body:", error);
            }
          }
        );
      };
      trySubscribe();
    };
    subscribeToWaiting();
  }, [client, sessionId]);

  useEffect(() => {
    const subscribeToWaiting = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("이어그리기 패스 구독 연결 실패");
        }
        console.log("이어그리기 패스 구독 연결중");
        const subscription = client.subscribe(
          `/sub/socket/draw/pass/${sessionId}`,
          (message) => {
            console.log("Received message:", message.body);

            try {
              const resJsondata = JSON.parse(message.body);
              setCurrentRole(resJsondata.data);
              handleGamingStart(true);
            } catch (error) {
              console.error("Error parsing message body:", error);
            }
          }
        );
      };
      trySubscribe();
    };
    subscribeToWaiting();
  }, [client, sessionId]);

  useEffect(() => {
    const subscribeToWaiting = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("이어그리기 결과 구독 연결 실패");
        }
        console.log("이어그리기 결과 구독 연결중");
        const subscription = client.subscribe(
          `/sub/socket/draw/data/${sessionId}`,
          (message) => {
            console.log("Received message:", message.body);

            try {
              const resJson = JSON.parse(message.body);
              if (resJson.data === -1) {
                setIsFail(true);
                const timer = setTimeout(() => {
                  setIsFail(false);
                  onHandleMike(true);
                  onHandleSpeaker(true);
                  handleGamingStart(false);
                }, 3000);
                return () => {
                  clearTimeout(timer);
                }
              } else {
                setIsClear(true);
                const timer = setTimeout(() => {
                  setIsClear(false);
                  onHandleMike(true);
                  onHandleSpeaker(true);
                  handleindexSet();
                }, 3000);
                return () => {
                  clearTimeout(timer);
                }
              }
            } catch (error) {
              console.error("Error parsing message body:", error);
            }
          }
        );
      };
      trySubscribe();
    };
    subscribeToWaiting();
  }, [client, sessionId]);

  const drawingGameStartPublisher = async () => {
    handleGamingStart(true);
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }

      const message = {
        rtcSession: `${sessionId}`,
        userId: `${myUserId}`,
      };
      client.send("/pub/draw/start", {}, JSON.stringify(message));
      console.log(message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  let DrawingGameRenderingState;
  switch (myRole) {
    case 1:
      DrawingGameRenderingState = (
        <DrawingDorothy
          client={client}
          sessionId={sessionId}
          myRole={myRole}
          myUserId={myUserId}
          currentRole={currentRole}
        />
      );
      break;
    case 2:
    case 3:
    case 4:
      DrawingGameRenderingState = (
        <DrawingAid
          client={client}
          sessionId={sessionId}
          keyword={keyword}
          myRole={myRole}
          myUserId={myUserId}
          currentRole={currentRole}
        />
      );
      break;
  }

  return (
    <div style={{height:'100%'}}>
      <iframe
        style={{display: "none"}}
        src="/audio/Unlucky Day_full.mp3?autoplay=true"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
      ></iframe>
      {isStart ? (
        DrawingGameRenderingState
      ) : (
        <DrawingReady
          myRole={myRole}
          client={client}
          sessionId={sessionId}
          R1={R1}
          R2={R2}
          R3={R3}
          R4={R4}
          onHandleStart={drawingGameStartPublisher}
        />
      )}
      {isClear && <div className={style.clearDiv}>Clear</div>}
      {isFail && <div className={style.failDiv}>Fail</div>}
    </div>
  );
};

export default DrawingGame;
