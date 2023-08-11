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
  const roundId = 1; // 일단 임시, 나중에 리덕스로 가져올거임
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
            const readyRole = resJson.role;
            const readyState = resJson.state;
            const readyStage = resJson.stage;


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
  
  const [gameId, setGameId] = useState(0);
  const [turn, setTurn] = useState(1);
  const [resAnswer, setResAnswer] = useState(0);

  const [isStartBtnActive, setIsStartBtnActive] = useState(true); // 예시 값으로 true 설정
  // => 4명이 준비하면 true로 바꿔줄 값
  const host = 1; // 일단 임시, 나중에 리덕스로 가져올거임

  const [boardData, setBoardData] = useState([
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ']
  ]);
  
  // 정답 받을 보드
  const [tableData, setTableData] = useState([
    [' ',' ',' ',' ',' ']
  ])

  // socket
  // 1스테이지 준비 구독 sub
  // const subscribeToStage1Ready = () => {
  //   console.log("1스테이지 ready 페이지 소켓연결1");
  //   // /sub/socket/calculation/start/{roundId}/ 경로로 구독 요청
  //   const subscription = client.subscribe(`/sub/socket/calculation/ready/${roundId}/${sessionId}`, (message) => {
  //     console.log('Received message:', message.body);
      
  //     try {
  //       // JSON 문자열을 JavaScript 객체로 변환
  //       const resJsondata = JSON.parse(message.body);
    
  //       // 객체의 속성을 활용하여 처리
  //       const resRole = resJsondata.role;

  //       // 응답에 의한 처리들 (역할군 state 변경)
  //       if (myRole === 1) {
  //         if (dorothyState === 0) {
  //           setDorothyState(1);
  //         } else {
  //           setDorothyState(0);
  //         }
  //       } else if (myRole === 2) {
  //         if (lionState === 0) {
  //           setLionState(1);
  //         } else {
  //           setLionState(0);
  //         }
  //       } else if (myRole === 3) {
  //         if (heosuState === 0) {
  //           setHeosuState(1);
  //         } else {
  //           setHeosuState(0);
  //         }
  //       } else if (myRole === 4) {
  //         if (twState === 0) {
  //           setTwState(1);
  //         } else {
  //           setTwState(0);
  //         }
  //       }

  //     } catch (error) {
  //       console.error('Error parsing message body:', error);
  //     }

  //   });
  // }

  // 1스테이지 게임 준비 버튼 pub
  const sendStage1Ready = () => {
    // /pub/calculation/ready/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
      
      const message = {
        "session": "9e648d2d-5e2e-42b3-82fc-b8bef8111cbe",
        "role": myRole,
      };
      
      client.send(`/pub/calculation/ready/${roundId}`, {}, JSON.stringify(message));
      console.log("준비완료 누름");
      
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // 1스테이지 게임 시작 sub
  const subscribeToStage1Start = () => {
    // /sub/socket/calculation/start/{roundId}/{sessionId} 경로로 구독 요청
    const subscription = client.subscribe(`/sub/socket/calculation/start/${roundId}/${sessionId}`, (message) => {
      console.log('Received message:', message.body);
      console.log("보드판 제공을 위한 소켓 연결");

      try {
        // JSON 문자열을 JavaScript 객체로 변환
        const resJsondata = JSON.parse(message.body);
    
        // 객체의 속성을 활용하여 처리
        const resGameId = resJsondata.data.gameId;
        const resTurn = resJsondata.data.turn;
        const numberBoardArray = resJsondata.data.numberBoard;
        
        setGameId(resGameId);
        console.log("받아온 gameId는? : " + resGameId);
        console.log("바꾼 gameId는? : " + gameId);
        setTurn(resTurn);
        setBoardData(numberBoardArray);
        console.log(boardData);
        
        props.changeIsReady();
        
      } catch (error) {
        console.error('Error parsing message body:', error);
      }
    });
  }

  // 1스테이지 게임시작 버튼 누름 pub
  const sendStage1Start = () => {
    console.log("게임시작버튼 누름");
    // /pub/calculation/start/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      client.send(`/pub/calculation/start/${roundId}`);
      console.log("게임시작버튼 누름 -> 넘어감");
      
      props.changeIsReady();
      
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // 알파벳 선택하는게 실시간으로 보이는 pub sub 필요

  // 1스테이지 알파벳 선택 sub
  const subscribeToStage1SelectCells = () => {
    // /sub/socket/calculation/helpersubmit/{roundId} 경로로 구독 요청
    client.subscribe(`/sub/socket/calculation/helpersubmit/${roundId}/${sessionId}`, (message) => {
      console.log('Received message:', message.body);
      console.log("조력자 숫자 제출을 위한 소켓 연결");

      try {
        // JSON 문자열을 JavaScript 객체로 변환
        const resJsondata = JSON.parse(message.body);
    
        // 객체의 속성을 활용하여 처리
        const selectedNumsArray = resJsondata.data.selectedNums;
        setBoardData(selectedNumsArray);
        console("배열: "+selectedNumsArray);
        console.log(boardData);

        
      } catch (error) {
        console.error('Error parsing message body:', error);
      }
    });
  }

  // 1스테이지 알파벳 선택 pub
  const sendStage1SelectCells = () => {
    console.log("조력자 선택완료 누름");
    // /pub/calculation/helpersubmit/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      const message = {
        // "gameId": gameId
        "gameId": gameId,
        "selectedNums": selectedCells[selectedCells.length - 1],
      };

      console.log("gameId : " + gameId);
      console.log("turn : " + turn);

      client.send(`/pub/calculation/helpersubmit/${roundId}`, {}, JSON.stringify(message));
      console.log("조력자 선택완료 누름 -> 넘어감");
      sendStage1GetAnswer(); // 문제도 같이 띄워야함
      
      props.changeIsIndex();
      
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }

  // 1스테이지 문제 공개 sub
  const subscribeToStage1GetAnswer = () => {
    // /sub/socket/calculation/getanswer/{roundId}/{sessionId} 경로로 구독 요청
    client.subscribe(`/sub/socket/calculation/getanswer/${roundId}/${sessionId}`, (message) => {
      console.log('Received message:', message.body);
      console.log("문제가 뭘까요?");

      try {
        // JSON 문자열을 JavaScript 객체로 변환
        const resJsondata = JSON.parse(message.body);
    
        // 객체의 속성을 활용하여 처리
        const resAnswer = resJsondata.data.answer;

        setResAnswer(resAnswer);
        // props.changeIsIndex();
        
      } catch (error) {
        console.error('Error parsing message body:', error);
      }
    });
  }

  // 1스테이지 문제 공개 pub
  const sendStage1GetAnswer = () => {
    // /pub/calculation/getanswer/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      client.send(`/pub/calculation/getanswer/${roundId}`);
      console.log("정답을 받아왔음");
      
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // 1스테이지 정답 선택 sub
  const subscribeToStage1SelectAns = () => {
    // /sub/socket/calculation/submitanswer/{roundId}/{sessionId} 경로로 구독 요청
    client.subscribe(`/sub/socket/calculation/submitanswer/${roundId}/${sessionId}`, (message) => {
      console.log('Received message:', message.body);
      console.log("허수아비 정답 제출을 위한 소켓 연결");

      try {
        // JSON 문자열을 JavaScript 객체로 변환
        const resJsondata = JSON.parse(message.body);
    
        // 객체의 속성을 활용하여 처리
        const selectednumber = resJsondata.data.number;

        // 정답 맞는지 체크 해야함
        // @@@@@@@@@@@@@@@@@@@@@@
        
        
      } catch (error) {
        console.error('Error parsing message body:', error);
      }
    });
  }

  // 1스테이지 정답 선택 pub
  const sendStage1SelectAns = () => {
    console.log("허수아비 정답제출 누름");
    // /pub/calculation/submitanswer/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      const message = {
        // "gameId": gameId
        "gameId": turn,
        "selectedNums": selectedAns[selectedAns.length - 1],
        "marks": selectedMarks[selectedMarks.length - 1]
      };

      console.log(gameId);
      console.log(selectedCells[selectedCells.length - 1]);

      client.send(`/pub/calculation/submitanswer/${roundId}`, {}, JSON.stringify(message));
      console.log("조력자 선택완료 누름 -> 넘어감");
      props.changeIsIndex();
      
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }


  // 조력자가 선택하는 알파벳 보드 배열로 저장하고 있을거야
  // // selectedCells와 setSelectedCells를 useState로 정의합니다.
  const [selectedCells, setSelectedCells] = useState([]);
  // 클릭 이벤트 처리 함수
  const handleCellClick = (cellValue) => {
    // 이미 선택된 칸인지 확인
    const isCellSelected = selectedCells.includes(cellValue);
    // 이미 선택된 값이 6개인 경우 더이상 선택하지 않음
    if (isCellSelected.length >= 6) {
      return;
    }

    // 이미 선택된 칸이라면 해당 값을 배열에서 제거
    // if (isCellSelected) {
    //   const updatedCells = selectedCells.filter((value) => value !== cellValue);
    //   setSelectedCells(updatedCells);
    // } else {// 새로 선택된 칸이라면 해당 값을 배열에 추가      
    //   const updatedCells = [...selectedCells, cellValue];
    //   setSelectedCells(updatedCells);
    // }
    if (isCellSelected) {
      setSelectedCells(selectedCells.filter((value) => value !== cellValue));
    } else {
      setSelectedCells([...selectedCells, cellValue]);
    }
  };

  // 허수아비가 선택하는 정답 보드 배열로 저장하고 있을거야
  // // selectedAns와 setSelecteAns를 useState로 정의합니다.
  const [selectedAns, setSelectedAns] = useState([]);
  // 클릭 이벤트 처리 함수
  const handleAnsClick = (AnsValue) => {
    // 이미 선택된 칸인지 확인
    const isAnsSelected = selectedAns.includes(AnsValue);
    if (selectedAns.length >= 3) {
      // 이미 선택된 값이 3개인 경우 더이상 선택하지 않음
      return;
    }

    if (isAnsSelected) {
      // 이미 선택된 칸이라면 해당 값을 배열에서 제거
      const updatedAns = selectedAns.filter((value) => value !== AnsValue);
      setSelectedAns(updatedAns);

    } else {
      // 새로 선택된 칸이라면 해당 값을 배열에 추가
      const updatedAns = [...selectedAns, AnsValue];
      setSelectedAns(updatedAns);
    }
  };
  // // selectedMarks와 setSelecteMarks를 useState로 정의합니다.
  const [selectedMarks, setSelectedMarks] = useState([]);

  // 클릭 이벤트 처리 함수
  const handleMarksClick = (MarksValue) => {
    // 이미 선택된 칸인지 확인
    const isMarksSelected = selectedMarks.includes(MarksValue);
    if (selectedMarks.length >= 2) {
      // 이미 선택된 값이 2개인 경우 더이상 선택하지 않음
      return;
    }

    if (isMarksSelected) {
      // 이미 선택된 칸이라면 해당 값을 배열에서 제거
      const updatedMarks = selectedMarks.filter((value) => value !== MarksValue);
      setSelectedMarks(updatedMarks);

    } else {
      // 새로 선택된 칸이라면 해당 값을 배열에 추가
      const updatedMarks = [...selectedMarks, MarksValue];
      setSelectedMarks(updatedMarks);
    }
  };

  

  useEffect(() => {
    // subscribeToStage1Ready();
    subscribeToStage1Start();
    subscribeToStage1SelectCells();
    subscribeToStage1SelectAns();
    subscribeToStage1GetAnswer();
  }, [client]);


  // 게임 part
  // 1스테이지
  if (isStage === 1 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.BoardStyle}>
            <NumberBoard boardData={boardData} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.BoardStyle}>
            <AlphaBoard onCellClick={handleCellClick} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <img
            src="image/tools/stage1SubBtn.png"
            alt="stage1SubBtn"
            className={style.selectBtn}
            onClick={sendStage1SelectCells}
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.BoardStyle2}>
            {/* <AlphaBoard /> */}
            <NumberBoard boardData={boardData} onClick={handleAnsClick}/>
          </div>
          <div className={style.MathBoardStyle}>
            <MathBoard onclick={handleMarksClick}/>
          </div>
          <div className={style.AnsBoardStyle}>
            <AnsBoard tableData={tableData}/>
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          {/* <div className={style.ansSubmitBtn} onClick={props.changeIsClear}>정답제출</div> */}
          <div className={style.ansSubmitBtn} onClick={sendStage1SelectAns}>정답제출</div>
          <div className={style.resetBtn}>리셋</div>
          <img
            src="image/tools/equal.png"
            alt="equal"
            className={style.equal}
          />
          <div className={style.rectangleStyle}>{resAnswer}</div>
        </div>
      </div>
    );
    // 2스테이지 게임시작
  } else if (isStage === 2 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <TrapGame client={client} sessionId={sessionId} myRole={myRole} handleindexSet={indexSet} />
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
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          {/* <div className={style.readyBtn} onClick={props.changeIsReady}> */}
          <div className={style.readyBtn} onClick={sendStage1Ready}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
          <div className={style.startBtn} style={{ display: isStartBtnActive && host === 1 ? 'flex' : 'none', }} onClick={sendStage1Start}>
            게임 시작
          </div>
          <img
            src="image/tools/checkmarker.png"
            className={style.checkDorothy}
            style={{ display: dorothyState === 1 ? 'block' : 'none' }}
          >
          </img>
        </div>
      </div>
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
