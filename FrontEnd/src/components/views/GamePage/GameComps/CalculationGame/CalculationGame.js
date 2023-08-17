import React, { useState, useEffect } from "react";
import CalculationHeosu from "./CalculationHeosu";
import CalculationAid from "./CalculationAid";
import CalculationReady from "./CalculationReady";
import style from "./CalculationGame.module.css"
import CustomAlert from "../Alert/alert";

const CalculationGame = ( { client, sessionId, myRole, handleindexSet, roundId, R1,R2,R3,R4, onHandleMike, onHandleCamera, onHandleSpeaker } ) => {
	// isStart 참이면 렌더링에 의해 분기되는 게임 페이지
	const [isStart, setIsStart] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isClear, setIsClear] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [volume1, setVolume1] = useState(0.7);
  
  // 하위 컴포넌트에서 현재 컴포넌트의 state를 바꿀 수 있게 해주는 handler
  const handleGamingStart = (status) => {
		setIsStart(status);
	};

  // 볼륨 조절
  const handleVolume1 = () => {
    setVolume1(0.3);
  };
	
  // 허수아비 화면 제어
  const [actorState, setActorState] = useState(0);
  const handleActorState = (status) => {
    setActorState(status);
  };

  // 조력자 화면 제어
  const [helperState, setHelperState] = useState(0);
  const handleHelperState = (status) => {
    setHelperState(status);
  };
	
	const [resAnswer, setResAnswer] = useState(0);

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
	  ['?','?','?','?','?']
	])

  // 입력 위치 헤더
  const [head, setHead] = useState(0);

  // 입력 데이터 갱신 
  const handletableData = (status) => {
    const temp = [...tableData[0]];
    temp[head] = status;
    setHead(head+1);
    setTableData([temp]);
  };

  // 입력 데이터 리셋
  const resetTable = () => {
    setTableData([['?','?','?','?','?']]);
    setHead(0);
  };

  // 타임 아웃 실패 - 안씀
  const failTimeOut = () => {
    setAlertMessage("실패요");
    resetTable();
    setActorState(0);
    setHelperState(0);
    setResAnswer(0);
    setBoardData(([
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ']
    ]));
    handleGamingStart(false);
  }

	// 사칙연산게임 시작 sub
	useEffect(() => {
    const subscribeToWaiting = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("사칙연산게임 시작 구독 연결 실패")
        }
        console.log("사칙연산게임 시작 구독 연결중")
        const subscription = client.subscribe(`/sub/socket/calculation/start/${roundId}/${sessionId}`, (message) => {
          console.log('Received message:', message.body);
          
          try {
        		const resJsondata = JSON.parse(message.body);

            // 시작 보드 데이터
						const numberBoardArray = resJsondata.data.numberBoard;
        		setBoardData(numberBoardArray);
						CalculationGameAnswerPublisher();
            // 게임 시작
            handleGamingStart(true);
          } catch (error) {
            console.error('Error parsing message body:', error);
          }
        });
      };
      trySubscribe();
    };
    subscribeToWaiting();
  }, [client, sessionId]);

	// 사칙연산게임 시작 pub
  const CalculationGameStartPublisher = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
      console.log("시작해줘")
			const message = {
				"session":`${sessionId}`,
			};
      console.log(message)
      console.log(roundId)

      client.send(`/pub/calculation/start/${roundId}`, {}, JSON.stringify(message));
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

	// 사칙연산게임 문제 공개 sub
	useEffect(() => {
		const subscribeToStage1GetAnswer = () => {
			const trySubscribe = () => {
				// /sub/socket/calculation/getanswer/{roundId}/{sessionId} 경로로 구독 요청
				client.subscribe(`/sub/socket/calculation/getanswer/${roundId}/${sessionId}`, (message) => {
					console.log('Received message:', message.body);
					try {
						const resJsondata = JSON.parse(message.body);
						const resAnswer = resJsondata.data.answer;
		
						setResAnswer(resAnswer);
						console.log("이게 답이다 : " + resAnswer);
						
					} catch (error) {
						console.error('Error parsing message body:', error);
					}
				});
			};
			trySubscribe();
		};
		subscribeToStage1GetAnswer();
	}, [client, sessionId]);
	
	// 사칙연산게임 문제 공개 pub
  const CalculationGameAnswerPublisher = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      client.send(`/pub/calculation/getanswer/${roundId}`);
      
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

	// 조력자 선택 알파벳 sub
	useEffect(() => {
		const subscribeToAidSelectedCells = () => {
			const trySubscribe = () => {
				// /sub/socket/calculation/helpersubmit/{roundId} 경로로 구독 요청
				client.subscribe(`/sub/socket/calculation/helpersubmit/${roundId}/${sessionId}`, (message) => {
					console.log('Received message:', message.body);
		
					try {
						// JSON 문자열을 JavaScript 객체로 변환
						const resJsondata = JSON.parse(message.body);
						const selectedNumsArray = resJsondata.data.selectedNums;

            setBoardData(selectedNumsArray);

            handleActorState(2);
            handleHelperState(2);
						
					} catch (error) {
						console.error('Error parsing message body:', error);
					}
				});
			};
			trySubscribe();
		};
		subscribeToAidSelectedCells();
	}, [client, sessionId]);

	// 1스테이지 정답 선택 sub
	useEffect (() => {
		const subscribeToStage1SelectAns = () => {
			const trySubscribe = () => {
				// /sub/socket/calculation/submitanswer/{roundId}/{sessionId} 경로로 구독 요청
				client.subscribe(`/sub/socket/calculation/submitanswer/${roundId}/${sessionId}`, (message) => {
					console.log('Received message:', message.body);
		
					try {
						// JSON 문자열을 JavaScript 객체로 변환
						const resJsondata = JSON.parse(message.body);

						const selectednumber = resJsondata.data.correct;
		
						if(selectednumber === true){
              setIsClear(true);
              const timer = setTimeout(() => {
                setIsClear(false);
                onHandleMike(true);
                onHandleSpeaker(true);
                handleindexSet(21);
              }, 3000);
              return () => {
                clearTimeout(timer);
              }
              
            } else if(selectednumber === false){
              setIsFail(true);
              const timer = setTimeout(() =>{
                setIsFail(false);
                resetTable();
                setActorState(0);
                setHelperState(0);
                setResAnswer(0);
                setBoardData(([
                  [' ', ' ', ' ', ' ', ' ', ' '],
                  [' ', ' ', ' ', ' ', ' ', ' '],
                  [' ', ' ', ' ', ' ', ' ', ' '],
                  [' ', ' ', ' ', ' ', ' ', ' '],
                  [' ', ' ', ' ', ' ', ' ', ' '],
                  [' ', ' ', ' ', ' ', ' ', ' ']
                ]));
                onHandleMike(true);
                onHandleSpeaker(true);
                handleGamingStart(false);
              }, 3000);
            }
					} catch (error) {
						console.error('Error parsing message body:', error);
					}
				});
			};
			trySubscribe();
		};
		subscribeToStage1SelectAns();
	}, [client, sessionId]);

	// 역할에 따른 게임페이지 조건부 렌더링
	let CalculationGameRenderingState;
	switch (myRole) {
		case 3:
			CalculationGameRenderingState = <CalculationHeosu boardData={boardData} client={client} sessionId={sessionId} roundId={roundId} resAnswer={resAnswer} onHandleActorState={handleActorState} actorState={actorState} tableData={tableData} onHandleTableData={handletableData} head={head} onHandleresetTable={resetTable} failTimeOut={failTimeOut} onHandleMike={onHandleMike} onHandleCamera={onHandleCamera} onHandleSpeaker={onHandleSpeaker}/>
			break;
		case 1:
		case 2:
		case 4:
			CalculationGameRenderingState = <CalculationAid boardData={boardData} myRole={myRole} client={client} sessionId={sessionId} roundId={roundId} resAnswer={resAnswer} onHandleHelperState={handleHelperState} helperState={helperState} head={head} tableData={tableData}/>
			break;
	}

	// CalculationGame 컴포넌트
	return (
		<div style={{height:'100%'}}>
      <iframe
        style={{display: "none"}}
        src="/audio/Brain Fade_full.mp3?autoplay=true"
        frameborder="0"
        allowfullscreen
        allow="autoplay"
        volume={volume1}
      ></iframe>
      {alertMessage && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
			{isStart ? CalculationGameRenderingState : <CalculationReady myRole={myRole} onHandleStart={CalculationGameStartPublisher} client={client} sessionId={sessionId} R1={R1} R2={R2} R3={R3} R4={R4} onHandleVolume1={handleVolume1}/>}
      {isClear && <div className={style.clearDiv}>Clear</div>}
      {isFail && <div className={style.failDiv}>Fail</div>}
		</div>

	);
};

export default CalculationGame;