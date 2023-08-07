import React, { useState, useEffect } from "react";
import {
  NumberBoard,
  AlphaBoard,
  MathBoard,
  AnsBoard,
  MiroRed,
  MiroGreen,
  MiroBlue,
} from "./Board";
import App from "./test";
import style from "./GameComps.module.css";
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  IntrodialogueData,
  dialogue1Data,
  dialogue2Data,
  dialogue3Data,
  dialogue4Data,
  OutrodialogueData,
} from "../../../scripts/Scripts";
import { client } from "stompjs";
import {Dnd,Sub} from "./Dnd";

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
    type: 'image',
    item: { src, alt },
    collect: monitor => ({
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
        cursor: 'move',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  );
};

const GameComp = (props) => {
  const isStage = props.isStage;
  const isIndex = props.isIndex;
  const client = props.client;
  const roundId = 1; // 일단 임시, 나중에 리덕스로 가져올거임
  const myRole = 1; // 일단 임시, 나중에 리덕스로 가져올거임
  const myTeamId = 1;

  const [dorothyState, setDorothyState] = useState(0);
  const [lionState, setLionState] = useState(0);
  const [heosuState, setHeosuState] = useState(0);
  const [twState, setTwState] = useState(0);

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
  
  // socket
  // 1스테이지 게임 준비
  const subscribeToStage1Select = () => {
    console.log("1스테이지 ready 페이지 소켓연결");
    // /sub/socket/calculation/start/{roundId}/ 경로로 구독 요청
    const sessionId = "9e648d2d-5e2e-42b3-82fc-b8bef8111cbe";
    const subscription = client.subscribe(`/sub/socket/calculation/ready/${roundId}/${sessionId}}`, (message) => {
      console.log('Received message:', message.body);

      try {
        // JSON 문자열을 JavaScript 객체로 변환
        const resJsondata = JSON.parse(message.body);
    
        // 객체의 속성을 활용하여 처리
        const resRole = resJsondata.role;

        console.log(resRole);

      } catch (error) {
        console.error('Error parsing message body:', error);
      }

    });
  }

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

      // 역할군 state 변경
      if (myRole === 1) {
        if (dorothyState === 0) {
          setDorothyState(1);
        } else {
          setDorothyState(0);
        }
      } else if (myRole === 2) {
        if (lionState === 0) {
          setLionState(1);
        } else {
          setLionState(0);
        }
      } else if (myRole === 3) {
        if (heosuState === 0) {
          setHeosuState(1);
        } else {
          setHeosuState(0);
        }
      } else if (myRole === 4) {
        if (twState === 0) {
          setTwState(1);
        } else {
          setTwState(0);
        }
      }
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

// 1스테이지 게임 시작
const sendStage1Start = () => {
  console.log("게임시작버튼 누름");
  // /pub/calculation/setboard/{roundId} 경로로 메시지 전송
  try {
    if (!client) {
      console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
      return;
    }

    client.send(`/pub/calculation/start/${roundId}`);
    props.changeIsReady();
    
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

const subscribeToStage1Start = () => {
  // /sub/socket/calculation/start/{roundId} 경로로 구독 요청
  console.log("보드판 제공을 위한 소켓 연결");
  const sessionId = "9e648d2d-5e2e-42b3-82fc-b8bef8111cbe";
  const subscription = client.subscribe(`/sub/socket/calculation/start/${roundId}/${sessionId}`, (message) => {
    console.log('Received message:', message.body);

    try {
      // JSON 문자열을 JavaScript 객체로 변환
      const resJsondata = JSON.parse(message.body);
  
      // 객체의 속성을 활용하여 처리
      const resRole = resJsondata.role;
      const numberBoardArray = resJsondata.data.numberBoard;
      console.log("a  "+numberBoardArray);

      setBoardData(numberBoardArray);

      //////////////////////////////////////////////
      // const qwe123 = {
      //   "data": [
      //     [11, 12, 13, 14, 15, 16],
      //     [17, 18, 19, 10, 11, 12],
      //     [3, 4, 5, 6, 7, 8],
      //     [9, 0, 1, 2, 3, 4],
      //     [25, 26, 27, 28, 29, 30],
      //     [31, 32, 33, 34, 35, 36]
      //   ]
      // };
      // const numqwe123 = qwe123.data;
      // console.log(numqwe123);
      // console.log(boardData);
      // setBoardData(numqwe123);
            
      //////////////////////////////////////////////
      
      // 숫자판을 String으로 가져오니까 쪼개서 넣어야함
      // const newBoardData = numberBoardArray.map(row => row.map(value => value));
      // setBoardData(newBoardData);

      // console.log(newBoardData);
      
    } catch (error) {
      console.error('Error parsing message body:', error);
    }

  });
}






  // selectedCells와 setSelectedCells를 useState로 정의합니다.
  const [selectedCells, setSelectedCells] = useState([]);

  // 클릭 이벤트 처리 함수
  const handleCellClick = (cellValue) => {
    // 이미 선택된 칸인지 확인
    const isCellSelected = selectedCells.includes(cellValue);

    if (isCellSelected) {
      // 이미 선택된 칸이라면 해당 값을 배열에서 제거
      setSelectedCells(selectedCells.filter((value) => value !== cellValue));
    } else {
      // 새로 선택된 칸이라면 해당 값을 배열에 추가
      setSelectedCells([...selectedCells, cellValue]);
    }
  };

  useEffect(() => {
    subscribeToStage1Select();
    subscribeToStage1Start();
  }, []);


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
    const handleCellClick = (cellValue) => {
      // 클릭 이벤트 처리 함수
      // 클릭한 칸의 값을 상태에 추가 또는 제거
      setSelectedCells((prevSelectedCells) =>
        prevSelectedCells.includes(cellValue)
          ? prevSelectedCells.filter((value) => value !== cellValue)
          : [...prevSelectedCells, cellValue]
      );
    };
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
            onClick={props.changeIsIndex}
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.BoardStyle2}>
            <AlphaBoard />
          </div>
          <div className={style.MathBoardStyle}>
            <MathBoard />
          </div>
          <div className={style.AnsBoardStyle}>
            <AnsBoard />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <div className={style.ansSubmitBtn} onClick={props.changeIsClear}>정답제출</div>
          <div className={style.resetBtn}>리셋</div>
          <img
            src="image/tools/equal.png"
            alt="equal"
            className={style.equal}
          />
          <div className={style.rectangleStyle}>36</div>
        </div>
      </div>
    );
    // 2스테이지
  } else if (isStage === 2 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.lionview}>사자가 보는 화면 일러스트</div>
          <div className={style.dist}>열쇠까지의 거리는 3칸입니다.</div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <img
            src="image/tools/liondir.png"
            alt="liondir"
            className={style.liondir}
          />
        </div>
        {/* 임시버튼임 */}
        <button onClick={props.changeIsIndex} >(임시)Next</button>
      </div>
    );
  } else if (isStage === 2 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroRed />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
        <button onClick={props.changeIsIndex} >(임시)Next</button>
      </div>
    );
  } else if (isStage === 2 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroGreen />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
        <button onClick={props.changeIsIndex} >(임시)Next</button>
      </div>
    );
  } else if (isStage === 2 && isIndex == 14) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroBlue />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
        <button onClick={props.changeIsClear} >(임시)Next</button>
      </div>
    );
    // 3스테이지
  } else if (isStage === 3 && isIndex == 11) {
      //somyeong
      const session = "9e648d2d-5e2e-42b3-82fc-b8bef8111cbe"; // 일단 임시, 나중에 리덕스로 가져올거임
      const userId = 1; // 일단 임시, 나중에 리덕스로 가져올거임
      return(
        <div>
          <Sub client={client} myRole={myRole} myTeamId={myTeamId} session={session} userId={userId}/>
          <Dnd props={props} client={client} myRole={myRole} session={session} userId={userId}/>
        </div>
      );
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
    return(
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
        <button onClick={props.changeIsIndex} >(임시)Next</button>
      </div>
    );
  } else if (isStage === 4 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <div className={style.word}>제시어</div>
          <div className={style.drawingDiv}> 그림판 </div>
        </div>
        <div className={style.stage4SubmitBtn} onClick={props.changeIsClear}>정답제출</div>
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
            src="image/tools/checkMarker.png"
            className={style.checkDorothy}
            style={{ display: dorothyState === 1 ? 'block' : 'none' }}
          >
          </img>
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex === 21) { // 클리어 후
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
  } else if (isStage === 2 && isIndex === 3) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex === 21) { // 클리어 후
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
  } else if (isStage === 3 && isIndex === 3) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G3}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
        </div>
      </div>
    );
  } else if (isStage === 3 && isIndex === 21) { // 클리어 후
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
  } else if (isStage === 4 && isIndex === 2) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
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
          <div style={{color: "white"}}>
            클리어 했습니다
          </div>
        </div>
      </div>
    );
  }
};

export { GameComp };
