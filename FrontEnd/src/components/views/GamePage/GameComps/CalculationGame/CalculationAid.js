import React, { useState, useEffect } from 'react';
import {
  NumberBoard,
  AlphaBoard,
  MathBoard,
  AnsBoard,
} from "./CalBoard";
import style from "./Calculation.module.css"

const CalculationAid = ({ boardData, myRole, client, sessionId, roundId, resAnswer, onHandleHelperState, helperState, head, tableData}) => {
	
	const [helperSubmit, setHelperSubmit] = useState(0);

	useEffect(() => {
		// 10초 후에 숫자판
		if (helperState === 0) {
			const timeoutId = setTimeout(() => {
				onHandleHelperState(1);
			}, 10000);

			return () => clearTimeout(timeoutId);
		// 15초 후에 제출
		} else if (helperState === 1) {
			const timeoutId = setTimeout(() => {
				// 6개의 숫자판 제출 - 제출 결과를 받으면 state->2
				console.log("헬퍼서브밋간닷")
				setHelperSubmit(1);
			}, 15000);

			return () => clearTimeout(timeoutId);
		}
  }, [helperState]);

	const boardData2 = [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', 'a', 'b', 'c', 'd'],
    ['e', 'f', 'g', 'h', 'i', 'j']
  ];

	// 도로시 1, 사자2, 양나 4	fail/default는 . 무시해야함

	const [sel11, setSel11] = useState('.');
	const [sel12, setSel12] = useState('.');
	const [sel21, setSel21] = useState('.');
	const [sel22, setSel22] = useState('.');
	const [sel41, setSel41] = useState('.');
	const [sel42, setSel42] = useState('.');

	const handleCheckSelect = (rsRole, rsState, rsCell, resLoc) => {
		if(rsState === 1){
			if(resLoc === 11){
				setSel11(rsCell);
			} else if(resLoc === 12){
				setSel12(rsCell);
			} else if(resLoc === 21){
				setSel21(rsCell);
			} else if(resLoc === 22){
				setSel22(rsCell);
			} else if(resLoc === 41){
				setSel41(rsCell);
			}	else if(resLoc === 42){
				setSel42(rsCell);
			}
		} else if(rsState === -1){
			if(resLoc === 11){
				setSel11('.');
			} else if(resLoc === 12){
				setSel12('.');
			} else if(resLoc === 21){
				setSel21('.');
			} else if(resLoc === 22){
				setSel22('.');
			} else if(resLoc === 41){
				setSel41('.');
			}	else if(resLoc === 42){
				setSel42('.');
			}
		}
	};	

	useEffect(() => {
    const subscribeToCellSelect = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("사칙연산게임 셀선택 구독 연결 실패")
        }
        console.log("사칙연산게임 셀선택 구독 연결중")
        const subscription = client.subscribe(`/sub/socket/calselect/${sessionId}`, (message) => {
          console.log('Received message:', message.body);

          try {	
        		const resJsondata = JSON.parse(message.body);
						const resRole = resJsondata.data.myRole;
						const resState = resJsondata.data.state;
						const resCell = resJsondata.data.cellValue;
						const resLoc = resJsondata.data.location;

						handleCheckSelect(resRole, resState, resCell, resLoc);
          } catch (error) {
            console.error('Error parsing message body:', error);
          }
        });
      };
      trySubscribe();
    };
    subscribeToCellSelect();
  }, [client, sessionId]);

	// 클릭 이벤트 처리 함수
	const handleCellClick = (cell) => {
		if (cell===sel11 || cell===sel12 || cell===sel21 || cell===sel22 || cell===sel41 || cell===sel42) {
			if (cell === sel11 || cell === sel12) {
				if(myRole === 1){
					if(cell === sel11){
						CalculationAidCellSelectPublisher(myRole, -1, cell, 11);
					} else if(cell === sel12){
						CalculationAidCellSelectPublisher(myRole, -1, cell, 12);
					}
				} else {
					console.log("내가 고른게 아니다.")
				}
			} else if(cell===sel21 || cell===sel22) {
				if(myRole === 2) {
					if(cell === sel21){
						CalculationAidCellSelectPublisher(myRole, -1, cell, 21);
					} else if(cell === sel22){
						CalculationAidCellSelectPublisher(myRole, -1, cell, 22);
					}
				} else {
					console.log("내가 고른게 아니다.")
				}
			} else if(cell===sel41 || cell===sel42) {
				if(myRole === 4) {
					if(cell === sel41){
						CalculationAidCellSelectPublisher(myRole, -1, cell, 41);
					} else if(cell === sel42){
						CalculationAidCellSelectPublisher(myRole, -1, cell, 42);
					}
				} else {
					console.log("내가 고른게 아니다.")
				}
			}
		} else {	// 이미 선택되지 않은 cell
			if(myRole===1){
				if(sel11==='.' || sel12==='.'){
					if(sel11==='.'){
						CalculationAidCellSelectPublisher(myRole, 1, cell, 11);
					} else{
						CalculationAidCellSelectPublisher(myRole, 1, cell, 12);
					}
				} else {
					console.log("나는 이미 두개를 골랐다.")
				}
			} else if(myRole===2){
				if(sel21==='.' || sel22==='.'){
					if(sel21==='.'){
						CalculationAidCellSelectPublisher(myRole, 1, cell, 21);
					} else{
						CalculationAidCellSelectPublisher(myRole, 1, cell, 22);
					}
				} else {
					console.log("나는 이미 두개를 골랐다.")
				}
			} else if(myRole===4){
				if(sel41==='.' || sel42==='.'){
					if(sel41==='.'){
						CalculationAidCellSelectPublisher(myRole, 1, cell, 41);
					} else{
						CalculationAidCellSelectPublisher(myRole, 1, cell, 42);
					}
				} else {
					console.log("나는 이미 두개를 골랐다.")
				}
			}
		}
	};

  const CalculationAidCellSelectPublisher = async (role, pubState, cellValue, loc) => {
    console.log("셀 선택 보냄");
    // /pub/calculation/helperselect/{roundId} 경로로 메시지 전송
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
			console.log(roundId);
			const message = {
				"rtcSession":`${sessionId}`,
				"myRole":role,
				"state":pubState,
				"location":loc,
				"cellValue":cellValue
			};

      client.send(`/pub/calselect`, {}, JSON.stringify(message));
            
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

	if (helperState === 0) {
		return (
			<div className={style.compStyle}>
				<div className={style.background_G1}>
					숫자판을 외워봐!~!~!!~!
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
	} else if (helperState === 1) {
		return (
			<div className={style.compStyle}>
				<div className={style.background_G1}>
					허수아비에게 도움이 될만한숫자를 골라줘@!!!
					<div className={style.BoardStyle}>
						<AlphaBoard onCellClick={handleCellClick} boardData={boardData2} sel11={sel11} sel12={sel12} sel21={sel21} sel22={sel22} sel41={sel41} sel42={sel42} client={client} roundId={roundId} helperSubmit={helperSubmit} myRole={myRole} />
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
          />
				</div>
			</div>
		);
	} else if (helperState === 2) {
		return (
			<div className={style.compStyle}>
				<div className={style.background_G1}>
        사자가 열심히 푸는중이야!
					<div className={style.BoardStyle2}>
          <AlphaBoard onHandleCellClick={handleCellClick} boardData={boardData} client={client} roundId={roundId} head={head} />
					</div>
					<div className={style.MathBoardStyle}>
					<MathBoard head={head}/>
					</div>
					<div className={style.AnsBoardStyle}>
          <AnsBoard tableData={tableData} head={head} />
					</div>
					<img
						src="image/tools/questionMark.png"
						alt="questionMark"
						className={style.iconStyle}
					/>
					<img
						src="image/tools/equal.png"
						alt="equal"
						className={style.equal}
					/>
					<div className={style.rectangleStyle}>{resAnswer}</div>
				</div>
			</div>
		)
	}
};

export default CalculationAid;