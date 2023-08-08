import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Stomp from 'stompjs';
import axios from "axios";

const SocketPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionIdFromURL = params.get("SessionId");

  // userId 가져오기 import { useSelector } from 'react-redux';
  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );
  var base64Url = accessToken.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jwtPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  const JsonPayload = JSON.parse(jwtPayload);
  console.log(JsonPayload)

  const CREATEROOM_SERVER_URL = 'http://localhost:8080/socket/room'
  const WEBSOCKET_SERVER_URL = 'ws://localhost:8080/ws';
  // params.SessionId  로컬개발용 ?SessionId=9e648d2d-5e2e-42b3-82fc-b8bef8111cbe
  // const SessionId = '9e648d2d-5e2e-42b3-82fc-b8bef8111cbe'; 

  const [SessionId, setSessionId] = useState(sessionIdFromURL || "DEFAULT");
  const [UserId, setuserId] = useState(1);
  const [client, setClient] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    const sessionIdFromURL = params.get("SessionId");
    setSessionId(sessionIdFromURL || "DEFAULT");

    createRoom(SessionId, UserId);
  }, []);

  // 소켓 연결 전 socket room 생성
  const createRoom = async (sessionId, userId) => {
    try {
      const response = await axios.post(CREATEROOM_SERVER_URL, {
        rtcSession: sessionId,
        userId: userId,
      });

      if (response.status !== 200) {
        throw new Error('방 생성에 실패하였습니다. 서버 상태 코드 / 세션Id를 확인하세요');
      }
      console.log('방 생성에 성공하였습니다. 소켓 연결을 시작합니다.');

      socketConnect(); // 방 생성 성공 후 소켓 연결 시작

    } catch (error) {
      console.error('Error creating a room:', error);
    }
  };

  // WebSocket Server 연결
  const socketConnect = () => {
    let newClient = Stomp.client(WEBSOCKET_SERVER_URL);
    newClient.debug = console.log; // 디버그 메시지 비활성화 null, 활성화 console.log

    // 연결 성공시 구독을 위한 isConnect state 갱신
    const onConnect = () => {
      console.log('웹소켓 연결완료');
      setIsConnect(true);
    };

    const onError = (error) => {
      console.error('웹소켓 연결 error:', error);
    };

    newClient.connect({}, onConnect, onError);

    setClient(newClient);

    return () => {
      newClient.disconnect();
    };
  }

  const send = async () => {
    try {
      if (!client || !client.connected) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      const message = {
        "type":"role",
        "rtcSession":`${SessionId}`,
        "userId":`${UserId}`,
        "message":"",
        "data":{
            "role":2,
            "state":1,
            "saveState":-1
        }
      };

      client.send('/pub/socket/role', {}, JSON.stringify(message));
      console.log('메시지 보냈음');
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  // 구독 함수 정의
  const subscribeToTopic = () => {
    // if (!client || !client.connected) {
    //   console.log('구독 실패');
    //   return;
    // }

    // /sub/socket/role/${SessionId} 경로로 구독 요청
    const subscription = client.subscribe(`/sub/socket/role/${SessionId}`, (message) => {
        console.log('Received message:', message);
        setReceivedMessages((prevMessages) => [...prevMessages, message]);
    });

    // 언마운트 시 구독 해제 처리 필요할지?

  };

  // 연결되면 구독메서드 실행하도록
  useEffect(() => {
    if (isConnect) {
      subscribeToTopic();
    }
  }, [isConnect]);

  const handleSendClick = () => {
    send();
  };

  const handleSubscribeClick = () => {
    subscribeToTopic();
  };

  return (
    <div>
      {/* 기존 버튼과 메시지 출력 */}
      <button onClick={handleSendClick}>역할선택</button>
      <button onClick={handleSubscribeClick}>수동 구독하기</button>

      {/* 메시지 출력 */}
      <div>
        <h3>응답 메시지:</h3>
        <ul>
          {receivedMessages.map((message, index) => (
            <li key={index}>{message.body}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocketPage;