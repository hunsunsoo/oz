import React, { useState, useEffect } from 'react';
import TrapLion from './TrapLion';
import TrapReady from './TrapReady';
import TrapAid from './TrapAid';
import { useSelector } from 'react-redux';

const TrapGame = ({client, sessionId, myRole, handleindexSet, R1,R2,R3,R4 }) => {
  // isStart 참이면 TrapGameRederingState에 의해 분기되는 게임페이지가 렌더링된다.
  const [isStart, setIsStart] = useState(false);
  // TrapGameRederingState 에서 나눠지는 조건 => myRole


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
          console.log("함정게임 시작 구독 연결 실패")
        }
        console.log("함정게임 시작 구독 연결중")
        const subscription = client.subscribe(`/sub/socket/trap/start/${myRole}/${sessionId}`, (message) => {
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
  

  // 함정게임 시작 publisher 메서드
  // 4명의 준비완료 상태 필요함!!!!!!!!!!!!!!!
  const trapGameStartPublisher = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }
          
      const message = {
        "rtcSession":`${sessionId}`,
        "userId":`${myUserId}`
      };
      client.send('/pub/trap/start', {}, JSON.stringify(message));
      console.log(message)
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  useEffect(() => {
    const subscribeLionMove = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("사자이동 구독 연결 실패")
        }
        console.log("사자이동 구독 연결중")
        const subscription = client.subscribe(`/sub/socket/trap/move/${sessionId}`, (message) => {
          console.log('Received message:', message.body);
          
          try {
            if(myRole === 2){
              setStartData(JSON.parse(message.body));
            }
          } catch (error) {
            console.error('Error parsing message body:', error);
          }
    
        });
      };
      trySubscribe();
    };
    subscribeLionMove();
  }, [client, sessionId]);

  useEffect(() => {
    const subscribeTrapResult = () => {
      const trySubscribe = () => {
        if (!client) {
          console.log("함정게임 결과 구독 연결 실패")
        }
        console.log("함정게임 결과 구독 연결중")
        const subscription = client.subscribe(`/sub/socket/trap/result/${sessionId}`, (message) => {
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
    subscribeTrapResult();
  }, [client, sessionId]);

  



  // 역할에 따른 게임페이지 조건부 렌더링
  let TrapGameRenderingState;
  switch (myRole) {
    case 2:
      TrapGameRenderingState = <TrapLion startData={startData} client={client} sessionId={sessionId} userId={myUserId} />
      break;
    case 1:
    case 3:
    case 4:
      TrapGameRenderingState = <TrapAid startData={startData} myRole={myRole} />
      break;
  }

  // TrapGame 컴포넌트
  return (
    <div style={{height:'100%'}}>
      {isStart ? TrapGameRenderingState : <TrapReady myRole={myRole} onHandleStart={trapGameStartPublisher} client={client} sessionId={sessionId} R1={R1} R2={R2} R3={R3} R4={R4} />}
    </div>
  );
};

export default TrapGame;