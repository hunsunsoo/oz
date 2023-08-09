import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Picture from "./Picture";
import style from "./GameComps.module.css";


/** 소켓 start **/
export function Sub({ client, myRole, session, userId}) {

            //게임 준비 데이터
            client.subscribe(`/sub/socket/puzzle/ready/${session}`, (message) => {
                console.log('Ready Received message:', message.body);
                try {
                    const resJsondata = JSON.parse(message.body);
                    const checkStart = resJsondata.data;

                    //1이면 모두 준비 완료 -> 게임시작
                    if (checkStart == 1)
                        sendGameStart(client, session, userId);
    
                } catch (error) {
                    console.error('Start Error parsing message body:', error);
                }
            });

            //게임 시작 데이터
            client.subscribe(`/sub/socket/puzzle/start/${myRole}/${session}`, (message) => {
                console.log('Start Received message:', message.body);
                try {
                    const resJsondata = JSON.parse(message.body);
                    const data = resJsondata.data;
                    const location = data.location;
                    const puzzle = data.puzzle;
                    console.log("위치: "+location+", 받은 상형문자: "+puzzle);
                    if (myRole == 3) {
                        //양철나무꾼 게임판

                    } else {
                        //조력자 게임판
                        
                    }
                } catch (error) {
                    console.error('Start Error parsing message body:', error);
                }

            });

            //정답 확인 데이터 
            client.subscribe(`/sub/socket/puzzle/data/${session}`, (message) => {
                console.log('Data Received message:', message.body);
                try {
                    // JSON 문자열을 JavaScript 객체로 변환
                    const resJsondata = JSON.parse(message.body);
                    const data = resJsondata.data;
                    if (data == 1) {
                        //정답임
                    } else {
                        //정답 아님
                    }

                } catch (error) {
                    console.error('Data Error parsing message body:', error);
                }
            });
}

function sendGameStart(client, session, userId){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "rtcSession" : session,
        "userId": userId
    };

    client.send(`/pub/puzzle/start`, {}, JSON.stringify(message));
}

//
function sendResetData(client, session, userId){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "rtcSession" : session,
        "userId": userId
    };

    client.send(`/pub/puzzle/reset`, {}, JSON.stringify(message));
}

//로그전달(상형문자를 끌어다 넣었을때)
function sendLogData(client, session, userId, location, num){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "userId":userId,
        "message":`${userId}번님이 ${location}위치에 ${num}을 넣었습니다`,
        "rtcSession": session
    };

    console.log("sendLogData :"+JSON.stringify(message));
    client.send(`/pub/puzzle/log`, {}, JSON.stringify(message));
}

//정답 확인하기
function sendAnswerCheck(client, session, userId){
    if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
    }

    const message = {
        "rtcSession":session,
        "userId": userId,
        "userAnswer": "1:56, 2:12, 3:22",
        "check": 1
    };

    client.send(`/pub/puzzle/data`, {}, JSON.stringify(message));
}

/** 소켓 end **/

const PictureList = [];
for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 6; j++) {
        const id = i * 10 + j;
        const key = i * 10 + j;
        const url = `/image/game/puzzleGame/puzzlePiece/${id}.png`;
        PictureList.push({ id, url });
    }
}

// PictureList 리스트 안에 36개 이중반복으로 이미지 아이디 및 경로 설정

function Board({ index, picture, onDrop }) {
    const [{ isOver }, drop] = useDrop({
        accept: "image", // "image" 유형의 드래그 가능한 항목만 허용.
        drop: (item) => onDrop(index, item.id),
        collect: (monitor) => ({
        isOver: !!monitor.isOver(), // 드롭 영역 위에 있는지 감시.
    }),
});

return (
    <div
    ref={drop}
      //   ref는 React에서 사용하는 특별한 속성으로, DOM 요소 또는 컴포넌트에 직접 접근할 수 있게 해준다-> 이 div의 ref속성은 drop이다
    style={{
        width: "50px",
        height: "50px",
        border: "2px solid black",
        display: "inline-block",
        margin: "10px",
        backgroundColor: isOver ? "rgba(0, 255, 0, 0.2)" : "white",
    }}
        className={`Board board-${index}`}
    >
        {picture && <Picture url={picture.url} id={picture.id} />}
    </div>
    );
}

export function Dnd({props, client, myRole, session, userId}) {
    const numberOfBoards = 6;

// sendGameStart(client, session, userId);
// sendLogData(client, session, userId);
// answerCheck(client, session, userId);

// 백엔드에서 받아올 수 있는 정답 키값 (전체 6개 중 3개만 사용)
const correctAnswers = {
    3: 11,
    4: 21,
    5: 41,
};

// 초기 보드 설정. 처음 3개는 고정된 이미지로 설정하고, 나머지 3개는 null,
// 여기에 백에서 보드(6개중에 위치랑 어떤 이미지 채울지 로직 작성해야)
const initialBoardsFromBackend = [
    { id: 11, url: "/image/game/puzzleGame/puzzlePiece/11.png", fixed: true },
    { id: 12, url: "/image/game/puzzleGame/puzzlePiece/12.png", fixed: true },
    { id: null, url: null, fixed: false },
    { id: null, url: null, fixed: false },
    { id: null, url: null, fixed: false },
    { id: 33, url: "/image/game/puzzleGame/puzzlePiece/13.png", fixed: true },
];

// 초기 보드를 useState로 설정
const [boards, setBoards] = useState(initialBoardsFromBackend);
const handleDrop = (boardIndex, pictureId) => {
    console.log(pictureId);
  if (boards[boardIndex].fixed) return; // 고정된 칸은 드롭 무시

    const picture = PictureList.find((p) => p.id === pictureId);
    setBoards((prevBoards) => {
    const newBoards = [...prevBoards];
    newBoards[boardIndex] = { ...picture, fixed: false }; // 고정되지 않은 이미지
    return newBoards;
    });
};
const checkAnswers = () => {
    const incorrect = Object.keys(correctAnswers).some((key) => {
        const boardIndex = parseInt(key, 10) - 1; // 인덱스는 0부터 시작하므로 -1
        const correctAnswer = correctAnswers[key];
        return !boards[boardIndex] || boards[boardIndex].id !== correctAnswer;
    });

    if (incorrect) {
        alert("틀렸습니다. 다시 시도해주세요.");
        setBoards(initialBoardsFromBackend); // 보드 상태 초기화
        return;
    }

    alert("정답입니다! 축하합니다.");
    };

    return (
    <div className={style.compStyle}>
        <div className={style.container}>
            <div className={style.puzzleLeft}>
            <div
                className="Boards"
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // 3개의 열을 생성
                gridTemplateRows: "repeat(3, 1fr)", // 2개의 행을 생성
                gap: "30px", // 각 그리드 항목 사이의 간격
                }}
            >
                {boards.map((picture, index) => (
                <Board
                    key={index}
                    index={index}
                    picture={picture}
                    onDrop={handleDrop}
                />
                ))}
            </div>
        </div>

        <div className={style.puzzleRight}>
            <div
                className="Picture"
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)", // 6개의 열을 생성
                gridTemplateRows: "repeat(6, 1fr)", // 6개의 행을 생성
                gap: "10px", // 각 그리드 항목 사이의 간격
                //   overflow: "hidden",
                }}
            >
            {PictureList.map((picture) => {
                return (
                    <Picture key={picture.id} url={picture.url} id={picture.id} />
                );
            })}
            </div>
        </div>
        <button onClick={checkAnswers}>정답 확인</button>
      </div>
      <img
        src="image/tools/questionMark.png"
        alt="questionMark"
        className={style.iconStyle}
      />
      <div className={style.stage3SelectBtn} onClick={props.changeIsClear}>
        선택완료
      </div>
    </div>
  );
}

