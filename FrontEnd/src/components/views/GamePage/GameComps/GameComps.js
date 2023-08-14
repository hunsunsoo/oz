import React, { useState, useEffect } from "react";
import {
  NumberBoard,
  AlphaBoard,
  MathBoard,
  AnsBoard,
} from "./Board";
import App from "./test";
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
  if (state == 0)
    state = 1;
  else 
    state = 0;

  const message = {
      "rtcSession" : session,
      "role": role,
      "state": state,
  };

  console.log("퍼즐게임 준비: " + state+", role: " + role);
  client.send(`/pub/puzzle/ready`, {}, JSON.stringify(message));
}

const GameComp = (props) => {
  const isStage = props.isStage;
  const isIndex = props.isIndex;

  const client = props.client;
  const roundId = props.roundId;
  const userId = props.userId;
  const myRole = props.myRole;
  const sessionId = props.sessionId;
  const myTeamId = 1;
  // const sessionId = "9e648d2d-5e2e-42b3-82fc-b8bef8111cbe"; // 일단 임시, 나중에 리덕스로 가져올거임

  const indexSet = props.indexSet


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
          console.log("게임 준비 구독 연결 실패")
        }
        console.log("게임 준비 구독 연결중")
        const subscription = client.subscribe(`/sub/socket/ready/${sessionId}`, (resMessage) => {
          console.log('Received message:', resMessage.body);
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
            console.error('Error parsing message body:', error);
          }
    
        });
      };
      trySubscribe();
    };
    subscribeToGameReady();
  }, [client, sessionId]);

  // 선택 상태 저장 갱신
  const handleReadyRole = (role, stage) => {
    if(role === 1){
      setDorothyState(stage);
    } else if(role === 2){
      setLionState(stage);
    } else if(role === 3){
      setHeosuState(stage);
    } else if(role === 4){
      setTwmState(stage);
    }
  };

  const handleCancelReady = (role) => {
    if(role === 1){
      setDorothyState(0);
    } else if(role === 2){
      setLionState(0);
    } else if(role === 3){
      setHeosuState(0);
    } else if(role === 4){
      setTwmState(0);
    }
  };

  // 여기까지 각게임 준비하기
  
  
  const [resAnswer, setResAnswer] = useState(0);

  const [isStartBtnActive, setIsStartBtnActive] = useState(true); // 예시 값으로 true 설정
  // => 4명이 준비하면 true로 바꿔줄 값
  const host = 1; // 일단 임시, 나중에 리덕스로 가져올거임





  // 게임 part
  // 1스테이지
  if (isStage === 1 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        {/* <div className={style.background_G1}>
          <div className={style.BoardStyle}>
            <NumberBoard boardData={boardData} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div> */}
        <CalculationGame client={client} sessionId={sessionId} myRole={myRole} handleindexSet={indexSet} roundId={roundId}
                  R1={dorothyState} R2={lionState} R3={heosuState} R4={twmState}/>
      </div> 
    );
  } else if (isStage === 1 && isIndex == 12) {
    return (
      // <div className={style.compStyle}>
      //   <div className={style.background_G1}>
      //     <div className={style.BoardStyle}>
      //       <AlphaBoard onCellClick={handleCellClick} />
      //     </div>
      //     <img
      //       src="image/tools/questionMark.png"
      //       alt="questionMark"
      //       className={style.iconStyle}
      //     />
      //     <img
      //       src="image/tools/stage1SubBtn.png"
      //       alt="stage1SubBtn"
      //       className={style.selectBtn}
      //       onClick={sendStage1SelectCells}
      //     />
      //   </div>
      // </div>
      null
    );
  } else if (isStage === 1 && isIndex == 13) {
    return (
      // <div className={style.compStyle}>
      //   <div className={style.background_G1}>
      //     <div className={style.BoardStyle2}>
      //       {/* <AlphaBoard /> */}
      //       <NumberBoard boardData={boardData} onClick={handleAnsClick}/>
      //     </div>
      //     <div className={style.MathBoardStyle}>
      //       <MathBoard onclick={handleMarksClick}/>
      //     </div>
      //     <div className={style.AnsBoardStyle}>
      //       <AnsBoard tableData={tableData}/>
      //     </div>
      //     <img
      //       src="image/tools/questionMark.png"
      //       alt="questionMark"
      //       className={style.iconStyle}
      //     />
      //     {/* <div className={style.ansSubmitBtn} onClick={props.changeIsClear}>정답제출</div> */}
      //     <div className={style.ansSubmitBtn} onClick={sendStage1SelectAns}>정답제출</div>
      //     <div className={style.resetBtn}>리셋</div>
      //     <img
      //       src="image/tools/equal.png"
      //       alt="equal"
      //       className={style.equal}
      //     />
      //     <div className={style.rectangleStyle}>{resAnswer}</div>
      //   </div>
      // </div>
      null
    );
    // 2스테이지 게임시작
  } else if (isStage === 2 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <TrapGame client={client} sessionId={sessionId} myRole={myRole} handleindexSet={indexSet}
                  R1={dorothyState} R2={lionState} R3={heosuState} R4={twmState} />
      </div>
    );
  } else if (isStage === 2 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        {/* <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroRed />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div> */}
        <button onClick={props.changeIsIndex}>(임시)Next</button>
      </div>
    );
  } else if (isStage === 2 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        {/* <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroGreen />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div> */}
        <button onClick={props.changeIsIndex}>(임시)Next</button>
      </div>
    );
  } else if (isStage === 2 && isIndex == 14) {
    return (
      <div className={style.compStyle}>
        {/* <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroBlue />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div> */}
        <button onClick={props.changeIsClear}>(임시)Next</button>
      </div>
    );
    // 3스테이지
  } else if (isStage === 3 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <PuzzleGame client={client} sessionId={sessionId} myRole={myRole} handleindexSet={indexSet} />
      </div>
    );
      // <div className={style.compStyle}>
      //   <div className={style.background_G3}>
      //     <Sub client={client} myRole={myRole} sessionId={sessionId} userId={userId} />
      //     {/* <Dnd props={props} client={client} myRole={myRole} session={session} userId={userId}/> */}
      //       <img
      //         src="image/character/troop2.png"
      //         alt=""
      //         className={style.troop2}
      //       />
      //       <div className={style.howToPlayImg}>게임 방법 넣을 part</div>
      //       <div className={style.readyBtn} onClick={() => sendPuzzleReadyData(client, sessionId, myRole)}>
      //         준비 완료
      //       </div>
      //     <div className={style.howToPlayBtn}>게임 방법</div>
      //   </div>
      // </div>
    // return (
    //   <div className={style.compStyle}>
    //     <div className={style.container}>
    //       <div className={style.puzzleLeft}>
    //         <img src="/image/game/puzzleGame/puzzleGameBgHeart.JPG" alt="" className={style.puzzleImage} />
    //       </div>
    //       <DndProvider backend={HTML5Backend}>
    //         <div className={style.puzzleRight}>
    //           {Array.from({ length: 6 }, (_, row) =>
    //             Array.from({ length: 6 }, (_, col) => (
    //               <div key={row * 6 + col} className={style.gridImage}>
    //                 <Image
    //                   src={`/image/game/puzzleGame/puzzlePiece/${(row + 1) * 10 + (col + 1)}.png`} // 이미지 파일의 경로를 동적으로 생성
    //                   alt={`Image ${row * 6 + col + 1}`}
    //                 />
    //               </div>
    //             ))
    //           )}
    //         </div>
    //       </DndProvider>
    //     </div>
    //     <img
    //         src="image/tools/questionMark.png"
    //         alt="questionMark"
    //         className={style.iconStyle}
    //       />
    //     <div className={style.stage3SelectBtn} onClick={props.changeIsClear}>선택완료</div>
    //   </div>
    // );

    // 4스테이지
  } else if (isStage === 4 && isIndex === 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <div className={style.word}>수륙챙이</div>
          <div className={style.drawing}>
            <App></App>
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
        {/* 임시버튼임 */}
        <button onClick={props.changeIsIndex}>(임시)Next</button>
      </div>
    );
  } else if (isStage === 4 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <div className={style.word}>제시어</div>
          <div className={style.drawingDiv}> 그림판 </div>
        </div>
        <div className={style.stage4SubmitBtn} onClick={props.changeIsClear}>
          정답제출
        </div>
        <img
          src="image/tools/questionMark.png"
          alt="questionMark"
          className={style.iconStyle}
        />
      </div>
    );
    // 인트로 스토리
  } else if (isStage === 0 && isIndex <= 2) {
    return (
      <div className={style.compStyle}>
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
      <div className={style.compStyle}>
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
      <div className={style.compStyle}>
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
    // 1스테이지 스토리
  } else if (isStage === 1 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue1Data, isIndex);
    return (
      <div className={style.compStyle}>
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
  } else if (isStage === 1 && isIndex == 3) { // ready 화면 + 방법설명
    return (
      // <div className={style.compStyle}>
      //   <div className={style.background_G1}>
      //     <img 
      //       src="image/character/troop2.png"
      //       alt=""
      //       className={style.troop2}
      //     />
      //     <div className={style.howToPlayImg}>
      //       게임 방법 넣을 part
      //     </div>
      //     {/* <div className={style.readyBtn} onClick={props.changeIsReady}> */}
      //     <div className={style.readyBtn} onClick={sendStage1Ready}>
      //       준비 완료
      //     </div>
      //     <div className={style.howToPlayBtn}>
      //       게임 방법
      //     </div>
      //     <div className={style.startBtn} style={{ display: isStartBtnActive && host === 1 ? 'flex' : 'none', }} onClick={sendStage1Start}>
      //       게임 시작
      //     </div>
      //     <img
      //       src="image/tools/checkmarker.png"
      //       className={style.checkDorothy}
      //       style={{ display: dorothyState === 1 ? 'block' : 'none' }}
      //     >
      //     </img>
      //   </div>
      // </div>
      null
    );
  } else if (isStage === 1 && isIndex === 21) {
    // 클리어 후
    const characterImageClass = getCharacterClass(dialogue1Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle}>
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
    // 2스테이지 스토리
  } else if (isStage === 2 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue2Data, isIndex);
    return (
      <div className={style.compStyle}>
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
    // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <img
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>게임 방법 넣을 part</div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>게임 방법</div>
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex === 21) {
    // 클리어 후
    const characterImageClass = getCharacterClass(dialogue2Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle}>
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
    // 3스테이지 스토리
  } else if (isStage === 3 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue3Data, isIndex);
    return (
      <div className={style.compStyle}>
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
  } else if (isStage === 3 && isIndex === 3) {
    // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        {/* <div className={style.background_G3}>
          <img
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>게임 방법 넣을 part</div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>게임 방법</div>
        </div> */}
      </div>
    );
  } else if (isStage === 3 && isIndex === 21) {
    // 클리어 후
    const characterImageClass = getCharacterClass(dialogue3Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle}>
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
    // 4스테이지 스토리
  } else if (isStage === 4 && isIndex <= 1) {
    const characterImageClass = getCharacterClass(dialogue3Data, isIndex);
    return (
      <div className={style.compStyle}>
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
    // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <img
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>게임 방법 넣을 part</div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>게임 방법</div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex <= 9) {
    const characterImageClass = getCharacterClass(OutrodialogueData, isIndex);
    return (
      <div className={style.compStyle}>
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
      <div className={style.compStyle}>
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
