import React, { useState, useEffect } from "react";
import CalculationHeosu from "./CalculationHeosu";
import CalculationAid from "./CalculationAid";
import CalculationReady from "./CalculationReady";

const CalculationGame = ( { client, sessionId, myRole, handleindexSet, roundId, R1,R2,R3,R4 } ) => {
	// isStart 참이면 렌더링에 의해 분기되는 게임 페이지
	const [isStart, setIsStart] = useState(false);
  const handleGamingStart = (status) => {
		setIsStart(status);
	};
	
  const [actorState, setActorState] = useState(0);
  const handleActorState = (status) => {
    setActorState(status);
  };

  const [helperState, setHelperState] = useState(0);
  const handleHelperState = (status) => {
    setHelperState(status);
  };
	
	const [resAnswer, setResAnswer] = useState(0);

	const [turn, setTurn] = useState(0);
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

  const [head, setHead] = useState(0);

  const handletableData = (status) => {

    const temp = [...tableData[0]];
    temp[head] = status;
    setHead(head+1);
    setTableData([temp]);
  };

  const resetTable = () => {
    setTableData([['?','?','?','?','?']]);
    setHead(0);
  };

  const failTimeOut = () => {
    alert("실패요");
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
						// JSON 문자열을 JavaScript 객체로 변환
        		const resJsondata = JSON.parse(message.body);
            // setStartData(JSON.parse(message.body));
						
        		// 객체의 속성을 활용하여 처리
						const resTurn = resJsondata.data.turn;
						const numberBoardArray = resJsondata.data.numberBoard;
						setTurn(resTurn);
        		setBoardData(numberBoardArray);
						CalculationGameAnswerPublisher();
        
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

	// 게임시작 pub
  const CalculationGameStartPublisher = async () => {
    console.log("게임시작버튼 누름");
    // /pub/calculation/start/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

			const message = {
				"session":`${sessionId}`,
			};

      client.send(`/pub/calculation/start/${roundId}`, {}, JSON.stringify(message));
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

	// 1스테이지 문제 공개 sub
	useEffect(() => {
		const subscribeToStage1GetAnswer = () => {
			const trySubscribe = () => {
				// /sub/socket/calculation/getanswer/{roundId}/{sessionId} 경로로 구독 요청
				client.subscribe(`/sub/socket/calculation/getanswer/${roundId}/${sessionId}`, (message) => {
					console.log('Received message:', message.body);
					try {
						// JSON 문자열을 JavaScript 객체로 변환
						const resJsondata = JSON.parse(message.body);
				
						// 객체의 속성을 활용하여 처리
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
	
	// 1스테이지 문제 공개 pub
  const CalculationGameAnswerPublisher = async () => {
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
				
						// 객체의 속성을 활용하여 처리
						const selectedNumsArray = resJsondata.data.selectedNums;
						
						          
            // 여기 응답이 제대로 왔다면
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
					console.log("허수아비 정답 제출을 위한 소켓 연결");
		
					try {
						// JSON 문자열을 JavaScript 객체로 변환
						const resJsondata = JSON.parse(message.body);
				
						// 객체의 속성을 활용하여 처리
						const selectednumber = resJsondata.data.correct;
		
						if(selectednumber === true){
              alert("성공이요");
              handleindexSet(21);
            } else if(selectednumber === false){
              alert("실패요");
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
					} catch (error) {
						console.error('Error parsing message body:', error);
					}
				});
			};
			trySubscribe();
		};
		subscribeToStage1SelectAns();
	}, [client, sessionId]);







	// useEffect(() => {
	// 	const subscribeCalculationResult = () => {
	// 		const trySubscribe = () => {
	// 			if (!client) {
  //         console.log("사칙연산게임 결과 구독 연결 실패")
  //       }
	// 			console.log("사칙연산게임 결과 구독 연결중")
	// 			const subscription = client.subscribe(`/sub/socket/calculation/submitanswer/${sessionId}`, (message) => {
	// 				console.log('Received message:', message.body);

	// 				try {
	// 					const resJson = JSON.parse(message.body);
	// 					if (resJson.data.correct === false) {
	// 						alert("실패입니다! 게임이 다시 시작됩니다 준비화면으로 돌아갑니다.");
	// 						handleGamingStart(false);
	// 					} else if (resJson.data.correct === true) {
	// 						alert("성공입니다! 다음 게임으로 넘어갑니다.")
  //             // 다음 페이지는
  //             handleindexSet(21);
	// 					}
	// 				} catch (error) {
	// 					console.error('Error parsing message body:', error);
	// 				}
	// 			});
	// 		};
	// 		trySubscribe();
	// 	};
	// 	subscribeCalculationResult();
	// }, [client, sessionId]);

	// 역할에 따른 게임페이지 조건부 렌더링
	let CalculationGameRenderingState;
	switch (myRole) {
		case 3:
			CalculationGameRenderingState = <CalculationHeosu boardData={boardData} client={client} sessionId={sessionId} roundId={roundId} resAnswer={resAnswer} onHandleActorState={handleActorState} actorState={actorState} tableData={tableData} onHandleTableData={handletableData} head={head} onHandleresetTable={resetTable} failTimeOut={failTimeOut} />
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
			{isStart ? CalculationGameRenderingState : <CalculationReady myRole={myRole} onHandleStart={CalculationGameStartPublisher} client={client} sessionId={sessionId} R1={R1} R2={R2} R3={R3} R4={R4} />}
		</div>
	);
};

export default CalculationGame;