import React, { useState, useEffect } from "react";
import PuzzleReady from "./PuzzleReady";
import PuzzleAid from "./PuzzleAid";
import PuzzleTwm from "./PuzzleTwm";
import { useSelector } from "react-redux";
import style from "./PuzzleGame.module.css";
import GameReady from "../GameReady";

const PuzzleGame = ({ client, sessionId, myRole, handleindexSet, R1,R2,R3,R4 }) => {
  const [isStart, setIsStart] = useState(false);
  const stage = 3;

  const [isClear, setIsClear] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [volume3, setVolume3] = useState(0.7);

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

  const [turn, setTurn] = useState(0);

  // 게임 시작 데이터
  const [startData, setStartData] = useState(null);

  // 하위 컴포넌트에서 현재 컴포넌트의 state를 바꿀 수 있게 해주는 콜백함수
  const handleGamingStart = (status) => {
    setIsStart(status);
  };

  // 볼륨 조절
  const handleVolume3 = () => {
    setVolume3(0.3);
  };

  // 게임시작 - 게임방법 / 게임중 상태를 바꿔줌 startData를 받아 넘겨줌
  useEffect(() => {
    const subscribeToPuzzleStart = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("상형문자게임 시작 구독 연결 실패");
        }
        console.log("상형문자게임 시작 구독 연결중");
        const subscription = client.subscribe(
          `/sub/socket/puzzle/start/${myRole}/${sessionId}`,
          (message) => {
            console.log("Received message:", message.body);

            try {
              const resJsondata = JSON.parse(message.body);
              const location = resJsondata.data.location;
              const puzzle = resJsondata.data.puzzle;
              let info = {
                location: location,
                puzzle: puzzle,
              };
              // 받은 데이터에서 location, puzzle을 넘기고 게임시작 상태로바꿈
              setStartData(info);
              handleGamingStart(true);
            } catch (error) {
              console.error("Error parsing message body:", error);
            }
          }
        );
      };
      trySubscribe();
    };
    subscribeToPuzzleStart();
  }, [client, sessionId]);

  // 게임 결과 구독
  useEffect(() => {
    const subscribeToPuzzleResult = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("상형문자게임 결과 구독 연결 실패");
        }
        console.log("상형문자게임 결과 구독 연결중");
        const subscription = client.subscribe(
          `/sub/socket/puzzle/data/${sessionId}`,
          (message) => {
            console.log("Received message:", message.body);

            try {
              const resJson = JSON.parse(message.body);

              if (resJson.data === 1) {
                setIsClear(true);
                const timer = setTimeout(() => {
                  setIsClear(false);
                  handleindexSet(21);
                }, 3000);
                return () => {
                  clearTimeout(timer);
                }
              } else if (resJson.data === -1) {
                setIsFail(true);
                const timer = setTimeout(() => {
                  setIsFail(false);
                  setTurn(turn + 1);
                  handleGamingStart(false);
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
    subscribeToPuzzleResult();
  }, [client, sessionId]);

  const handlerGameStartOrReset = () => {
    if (turn === 0) {
      puzzleGameStartPublisher();
    } else {
      puzzleGameResetPublisher();
    }
  };

  // 게임시작 publisher
  const puzzleGameStartPublisher = async () => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }

      const message = {
        rtcSession: `${sessionId}`,
        userId: `${myUserId}`,
      };
      client.send("/pub/puzzle/start", {}, JSON.stringify(message));
      console.log(message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  // 리셋 publisher
  const puzzleGameResetPublisher = async () => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }

      const message = {
        rtcSession: sessionId,
        userId: myUserId,
      };

      client.send(`/pub/puzzle/reset`, {}, JSON.stringify(message));
      console.log(message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  // 역할에 따른 게임페이지 조건부 렌더링
  let PuzzleGameRenderingState;
  switch (myRole) {
    case 1:
    case 2:
    case 3:
      PuzzleGameRenderingState = (
        <PuzzleAid startData={startData} myRole={myRole} />
      );
      break;
    case 4:
      PuzzleGameRenderingState = (
        <PuzzleTwm
          startData={startData}
          client={client}
          sessionId={sessionId}
          userId={myUserId}
        />
      );
      break;
  }

  // PuzzleGame 컴포넌트
  return (
    <div style={{ height: "100%" }}>
      <iframe
        style={{display: "none"}}
        src="/audio/Dice Game_full.mp3?autoplay=true"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        volume={volume3}
      ></iframe>
      {isStart ? (
        PuzzleGameRenderingState
      ) : (
        <PuzzleReady
          myRole={myRole}
          onHandleStart={handlerGameStartOrReset}
          client={client}
          sessionId={sessionId}
          R1={R1} R2={R2} R3={R3} R4={R4}
          onHandleVolume3={handleVolume3}
        />
      )}
      {isClear && <div className={style.clearDiv}>Clear</div>}
      {isFail && <div className={style.failDiv}>Fail</div>}
    </div>
  );
};
export default PuzzleGame;
