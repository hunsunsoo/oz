import React, { useState, useEffect } from "react";
import { NumberBoard, AlphaBoard, MathBoard, AnsBoard } from "./Board";
import style from "./GameComps.module.css";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  IntrodialogueData,
  dialogue1Data,
  dialogue2Data,
  dialogue3Data,
  dialogue4Data,
  OutrodialogueData,
} from "../../../scripts/Scripts";
import { client } from "stompjs";
import { Sub, Dnd } from "./Puzzle";
import TrapGame from "./TrapGame/TrapGame";
import PuzzleGame from "./PuzzleGame/PuzzleGame";
import CalculationGame from "./CalculationGame/CalculationGame";
import DrawingGame from "./DrawingGame/DrawingGame";

const characterToClassMap = {
  도로시: "character_dorothy",
  허수아비: "character_scarecrow",
  사자: "character_lion",
  "양철 나무꾼": "character_tinman",
};
const getCharacterClass = (data, index) => {
  const characterName = data[index].character;
  return characterToClassMap[characterName];
};

const Image = ({ src, alt }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { src, alt },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <img
      ref={drag}
      src={src}
      alt={alt}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    />
  );
};

let state = 0;
function sendPuzzleReadyData(client, session, role) {
  if (state == 0) state = 1;
  else state = 0;

  const message = {
    rtcSession: session,
    role: role,
    state: state,
  };

  console.log("퍼즐게임 준비: " + state + ", role: " + role);
  client.send(`/pub/puzzle/ready`, {}, JSON.stringify(message));
}

const GameComp = (props) => {
  //게임 브라우저 컨트롤
  useEffect(() => {
    //뒤로가기 막기
    // window.history.pushState(null, null, window.location.href);
    // window.onpopstate = function (event) {
    //   window.history.pushState(null, null, window.location.href);
    // };

    //새로고침 막기
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "새로고침 시, 데이터가 손실되며 게임이 중단될 수 있습니다. 그래도 나가시겠습니까?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const isStage = props.isStage;
  const isIndex = props.isIndex;

  const client = props.client;
  const roundId = props.roundId;
  const userId = props.userId;
  const myRole = props.myRole;
  const sessionId = props.sessionId;
  const myTeamId = 1;
  // const sessionId = "9e648d2d-5e2e-42b3-82fc-b8bef8111cbe"; // 일단 임시, 나중에 리덕스로 가져올거임

  const indexSet = props.indexSet;

  // 각 4역할의 준비 상태
  // 0: default / 1:1번게임 준비 / 2:2번게임 준비 / 3:3번게임 준비 /4:4번게임 준비
  const [dorothyState, setDorothyState] = useState(0);
  const [lionState, setLionState] = useState(0);
  const [heosuState, setHeosuState] = useState(0);
  const [twmState, setTwmState] = useState(0);

  useEffect(() => {
    const subscribeToGameReady = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("게임 준비 구독 연결 실패");
        }
        console.log("게임 준비 구독 연결중");
        const subscription = client.subscribe(
          `/sub/socket/ready/${sessionId}`,
          (resMessage) => {
            console.log("Received message:", resMessage.body);
            // role 역할, stage 몇스테이지, state 1:준비 0:취소
            try {
              const resJson = JSON.parse(resMessage.body);
              const readyRole = resJson.data.role;
              const readyState = resJson.data.state;
              const readyStage = resJson.data.stage;

              // 누가 무엇을 골랐는지 상태 저장할 메서드 호출
              if (readyState === 1) {
                handleReadyRole(readyRole, readyStage);
              } else if (readyState === 0) {
                handleCancelReady(readyRole);
              }
            } catch (error) {
              console.error("Error parsing message body:", error);
            }
          }
        );
      };
      trySubscribe();
    };
    subscribeToGameReady();
  }, [client, sessionId]);

  // 선택 상태 저장 갱신
  const handleReadyRole = (role, stage) => {
    if (role === 1) {
      setDorothyState(stage);
    } else if (role === 2) {
      setLionState(stage);
    } else if (role === 3) {
      setHeosuState(stage);
    } else if (role === 4) {
      setTwmState(stage);
    }
  };

  const handleCancelReady = (role) => {
    if (role === 1) {
      setDorothyState(0);
    } else if (role === 2) {
      setLionState(0);
    } else if (role === 3) {
      setHeosuState(0);
    } else if (role === 4) {
      setTwmState(0);
    }
  };

  /** 게임 시작 **/
  // 인트로 스토리
  if (isStage === 0 && isIndex <= 2) {
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_S1}>
          <div className={style.illustration}>
            {IntrodialogueData[isIndex].character}
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 0 && isIndex <= 13) {
    const characterImageClass = getCharacterClass(IntrodialogueData, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_S2}>
          <div className={style.script}>
            {IntrodialogueData[isIndex].character}
            <br />
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 0 && isIndex <= 16) {
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_S3}>
          <div className={style.illustration}>
            {IntrodialogueData[isIndex].character}
            <br />
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
    /** 1스테이지 **/
    // 1스테이지 스토리
  } else if (isStage === 1 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue1Data, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G1}>
          <div className={style.script}>
            {dialogue1Data[isIndex].character}
            <br />
            <br />
            {dialogue1Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
    // 1스테이지 게임준비&시작
  } else if (isStage === 1 && isIndex == 3) {
    return (
      <div className={style.compStyle}>
      <CalculationGame client={client} sessionId={sessionId} myRole={myRole} handleindexSet={indexSet} roundId={roundId}
                R1={dorothyState} R2={lionState} R3={heosuState} R4={twmState}
                onHandleMike={props.onHandleMike} onHandleCamera={props.onHandleCamera} onHandleSpeaker={props.onHandleSpeaker}/>
    </div>
    );
  } else if (isStage === 1 && isIndex === 21) {
    // 클리어 후
    const characterImageClass = getCharacterClass(dialogue1Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G1}>
          <div className={style.script}>
            {dialogue1Data[3].character}
            <br />
            <br />
            {dialogue1Data[3].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
    /** 2스테이지 **/
    // 2스테이지 스토리
  } else if (isStage === 2 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue2Data, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G2}>
          <div className={style.script}>
            {dialogue2Data[isIndex].character}
            <br />
            <br />
            {dialogue2Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex === 3) {
    // 2스테이지 게임준비&시작
    return (
      <div className={style.compStyle}>
        <TrapGame
          client={client}
          sessionId={sessionId}
          myRole={myRole}
          handleindexSet={indexSet}
          R1={dorothyState}
          R2={lionState}
          R3={heosuState}
          R4={twmState}
        />
      </div>
    );
  } else if (isStage === 2 && isIndex === 21) {
    // 클리어 후
    const characterImageClass = getCharacterClass(dialogue2Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G2}>
          <div className={style.script}>
            {dialogue2Data[3].character}
            <br />
            <br />
            {dialogue2Data[3].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
    /** 3스테이지 **/
    // 3스테이지 스토리
  } else if (isStage === 3 && isIndex === 0) {
    const characterImageClass = getCharacterClass(dialogue3Data, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G3}>
          <div className={style.script}>
            {dialogue3Data[isIndex].character}
            <br />
            <br />
            {dialogue3Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 3 && isIndex === 1) {
    // 3스테이지 게임준비&시작
      return (
      <div className={style.compStyle}>
        <PuzzleGame
          client={client}
          sessionId={sessionId}
          myRole={myRole}
          handleindexSet={indexSet}
          R1={dorothyState}
          R2={lionState}
          R3={heosuState}
          R4={twmState}
        />
      </div>
    );
  }else if (isStage === 3 && isIndex === 21) {
    // 클리어 후
    const characterImageClass = getCharacterClass(dialogue3Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G3}>
          <div className={style.script}>
            {dialogue3Data[3].character}
            <br />
            <br />
            {dialogue3Data[3].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
    /** 4스테이지 **/
    // 4스테이지 스토리
  } else if (isStage === 4 && isIndex <= 1) {
    const characterImageClass = getCharacterClass(dialogue3Data, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_G4}>
          <div className={style.script}>
            {dialogue4Data[isIndex].character}
            <br />
            <br />
            {dialogue4Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 4 && isIndex === 2) {
    // 4스테이지 게임준비&시작
    return (
      <div className={style.compStyle}>
        <DrawingGame
          client={client}
          sessionId={sessionId}
          myRole={myRole}
          handleindexSet={props.changeIsStage}
          R1={dorothyState}
          R2={lionState}
          R3={heosuState}
          R4={twmState}
        />
      </div>
    );
    /** 모두 클리어시, 아웃트로 **/
  } else if (isStage === 5 && isIndex <= 9) {
    const characterImageClass = getCharacterClass(OutrodialogueData, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_S5}>
          <div className={style.script}>
            {OutrodialogueData[isIndex].character}
            <br />
            <br />
            {OutrodialogueData[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex <= 12) {
    const characterImageClass = getCharacterClass(OutrodialogueData, isIndex);
    return (
      <div className={style.compStyle} onClick={props.changeNextPage}>
        <div className={style.background_S6}>
          <div className={style[characterImageClass]}></div>
          <div className={style.illustration}>
            {OutrodialogueData[isIndex].character}
            <br />
            <br />
            {OutrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex === 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_S6}>
          <div style={{ color: "white" }}>클리어 했습니다</div>
        </div>
      </div>
    );
  }
};

export { GameComp };
