import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const DrawingGame = ({client, sessionId, myRole, handleindexSet}) => {
    const [isStart, setIsStart] = useState(false);


    const accessToken = useSelector(
        (state) => state.user.loginSuccess.headers.accesstoken
      );
      var base64Url = accessToken.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jwtPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const JsonPayload = JSON.parse(jwtPayload);
      const [myUserId, setuserId] = useState(JsonPayload.userId);
    
      const [startData, setStartData] = useState(null);

      // 하위 컴포넌트에서 현재 컴포넌트의 state를 바꿀 수 있게 해주는 handler
    const handleGamingStart = (status) => {
        setIsStart(status);
    };

    useEffect(() => {
        const subscribeToWaiting = () => {
        const trySubscribe = () => {
        if (!client) {
          console.log("이어그리기 시작 구독 연결 실패")
        }
        console.log("이어그리기 시작 구독 연결중")
        // 이어그리기 시작 주소 가져다 놓기
        const subscription = client.subscribe(`/sub/socket/draw/start/${myRole}/${sessionId}`, (message) => {
            console.log('Received message:', message.body);
              
          try {
            setStartData(JSON.parse(message.body));
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


  // 4명이 준비되었을 때 이어그리기를 시작함
    const drawingGameStartPublisher = async () => {
    try {
        if (!client) {
            console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
            return;
        }
            
        const message = {
            "rtcSession":`${sessionId}`,
            "userId":`${myUserId}`
        };
        client.send('/pub/draw/start', {}, JSON.stringify(message));
        console.log(message)
        } catch (error) {
        console.log('Error sending message:', error);
        }
    };

    useEffect(() => {
        const subscribeDrawingResult = () => {
            const trySubscribe = () => {
                if(!client) {
                    console.log("이어그리기 결과 구독 연결 실패")
                }
                console.log("이어그리기 게임 결과 구독 연결 중")
                const subscription = client.subscribe(`/sub/socket/draw/result/${sessionId}`, (message) => {
                    console.log('Received message:', message.body);
          
                    try {
                        const resJson = JSON.parse(message.body);
                        if(resJson.data.resultCode === 0){
                        alert("실패입니다! 게임이 다시 시작됩니다 준비화면으로 돌아갑니다.");
                        handleGamingStart(false);
                        } else if(resJson.data.resultCode === 1){
                        alert("성공입니다! 다음 게임으로 넘어갑니다.")
                        // 다음 페이지는
                        handleindexSet(21);
                        }
                        
                    } catch (error) {
                        console.error('Error parsing message body:', error);
                    }
                });
            };
            trySubscribe();
        };
        subscribeDrawingResult();
    }, [client, sessionId]);

    let DrawingGameRenderingState;
    switch (myRole) {
        case 1:
            DrawingGameRenderingState = <Dorothy startData={startData} client={client} sessionId={sessionId} />
        break;
        case 2:
        case 3:
        case 4:
            DrawingGameRenderingState = <DrawingAid startData={startData} myRole={myRole} />
        break;
    }

    return (
        <div style={{height:'100%'}}>
          {isStart ? DrawingGameRenderingState : <DrawingReady isStart={isStart} onHandleStart={drawingGameStartPublisher} client={client} sessionId={sessionId} />}
        </div>
      );
}

export default DrawingGame;