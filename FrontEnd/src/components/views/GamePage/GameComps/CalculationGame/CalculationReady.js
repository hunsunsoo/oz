import React, { useState, useEffect } from "react";
import style from "./CalculationReady.module.css";
import { useLocation } from "react-router-dom";
import GameModal from "../GameModal/GameModal";
import CustomAlert from "../Alert/alert";

const CalculationReady = ({
  myRole,
  onHandleStart,
  client,
  sessionId,
  R1,
  R2,
  R3,
  R4,
  onHandleVolume1
}) => {
  const stageval = 1;
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const host = params.get("host");

  const [amIHost, setAmIHost] = useState(host);
  const [amIReady, setAmIReady] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    if (myRole === 1) {
      if (R1 === 1) {
        setAmIReady(true);
      } else if (R1 === 0) {
        setAmIReady(false);
      }
    } else if (myRole === 2) {
      if (R2 === 1) {
        setAmIReady(true);
      } else if (R2 === 0) {
        setAmIReady(false);
      }
    } else if (myRole === 3) {
      if (R3 === 1) {
        setAmIReady(true);
      } else if (R3 === 0) {
        setAmIReady(false);
      }
    } else if (myRole === 4) {
      if (R4 === 1) {
        setAmIReady(true);
      } else if (R4 === 0) {
        setAmIReady(false);
      }
    }
  }, [myRole, R1, R2, R3, R4]);

  const handleStartAfterReady = () => {
    console.log(host);
    if (amIHost === "1") {
      if (R1 === 1 && R2 === 1 && R3 === 1 && R4 === 1) {
        console.log("여기");
        onHandleVolume1();
        onHandleStart(true);
      } else {
        setAlertMessage("4명이 준비 완료 상태가 아닙니다");
      }
    } else {
      setAlertMessage("내가 방장이 아니다.");
    }
  };

  const CalReadyPublisher = async (readyOrCancel) => {
    try {
      if (!client) {
        console.log("웹소켓이 연결중이 아닙니다. 메시지 보내기 실패");
        return;
      }

      const message = {
        type: "ready",
        rtcSession: `${sessionId}`,
        role: myRole,
        stage: 1,
        state: readyOrCancel,
        message: `${myRole}님이 ${readyOrCancel} (1준비 0취소)하셨습니다`,
      };

      client.send("/pub/socket/ready", {}, JSON.stringify(message));
      console.log("메시지 보냈음");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const onHandleExplain = () => {
    setShowModal(true);
  };

  return (
    <div className={style.compStyle}>
      <div className={style.background_G1}>
        <div className={style.charStyle}>
          <div className={style.firstDiv}>
            <img
              src="image/character/heosu_light.png"
              className={style.checkMain}
            ></img>
            {R3 === 1 && (
              <img
                src="image/tools/checkmarker.png"
                className={style.checkMarkExtra}
              ></img>
            )}
          </div>
          <div className={style.otherDiv}>
            <img
              src="image/character/dorothy.png"
              className={style.checkExtra}
            ></img>
            {R1 === 1 && (
              <img
                src="image/tools/checkmarker.png"
                className={style.checkMarkExtra}
              ></img>
            )}
          </div>
          <div className={style.otherDiv}>
            <img
              src="image/character/lionb.png"
              className={style.checkExtra}
            ></img>
            {R2 === 1 && (
              <img
                src="image/tools/checkmarker.png"
                className={style.checkMarkExtra}
              ></img>
            )}
          </div>
          <div className={style.otherDiv}>
            <img
              src="image/character/twb.png"
              className={style.checkExtra}
            ></img>
            {R4 === 1 && (
              <img
                src="image/tools/checkmarker.png"
                className={style.checkMarkExtra}
              ></img>
            )}
          </div>
        </div>
        <div className={style.guideStyle}>
          <div className={style.bottomDivStyle}>
            <div className={style.howToPlayBtn} onClick={onHandleExplain} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              게임 방법
            </div>

            <div
              className={style.readyBtn}
              onClick={() => {
                const readyOrCancel = amIReady ? 0 : 1;
                CalReadyPublisher(readyOrCancel);
              }}
              onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            >
              {amIReady ? "준비 취소" : "준비 완료"}
            </div>

            {amIHost === "1" && (
              <div className={style.startBtn} onClick={handleStartAfterReady} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                게임 시작
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <GameModal isStage={stageval} closeModal={() => setShowModal(false)} />
      )}
      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
};

export default CalculationReady;
