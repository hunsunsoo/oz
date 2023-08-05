import React, { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import { useLocation } from "react-router-dom";
import RTCViewLower from "./RTCViewLower";
import RTCViewCenter from './RTCViewCenter';
import Stomp from 'stompjs';
import axios from "axios";
import Header from "../Header/Header";
import GamingHeader from "../Header/GamingHeader";
import RoleSelect from "./RoleSelect";
import PlayGame from "./PlayGame";
import WaitingRoomOption from './WaitingRoomOption';

const GamePage = () => {
  // 컴포넌트 조건부 렌더링
  const [isGaming, setIsGaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [middleCon, setMiddleCon] = useState(1);

  // 세션 아이디 추출
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionIdFromURL = params.get("SessionId");

  const OPENVIDU_SERVER_URL = "https://i9b104.p.ssafy.io:8443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";
  const CREATEROOM_SERVER_URL = 'http://localhost:8080/socket/room'
  const WEBSOCKET_SERVER_URL = 'ws://localhost:8080/ws';

  const [mySessionId, setMySessionId] = useState(sessionIdFromURL || "DEFAULT");

  // RTC를 위한 state
  const [myUserName, setMyUserName] = useState(
    `Participant ${Math.floor(Math.random() * 100)}`
  );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [isMike, setIsMike] = useState(true);
  const [isCamera, setIsCamera] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isChat, setIsChat] = useState(false);

  // Socket을 위한 state
  const [UserId, setuserId] = useState(1);
  const [client, setClient] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);

  const userRef = useRef(null);

  // 페이지 생성시 접속 요청
  useEffect(() => {
    // RTC
    createToken(mySessionId)
      .then((token) => {
        joinSessionWithToken(token);
      })
      .catch((error) => {
        console.error("Error creating token:", error);
      });
    
    // Socket
    createRoom(mySessionId, UserId);

  }, [mySessionId]);

  // 연결되면 구독메서드 실행하도록
  useEffect(() => {
    if (isConnect) {
      // subscribeToTopic();
    }
  }, [isConnect]);

  // 접속 종료 처리
  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, []);

  // 헤더 조건부 렌더링 핸들러
  const handleToggleHeader = () => {
    setIsGaming(!isGaming);
  };

  const onbeforeunload = () => {
    leaveSession();
  };

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }

    setSession(undefined);
    setSubscribers([]);
    setMySessionId(undefined);
    setMyUserName(undefined);
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  // RTC 연결 상태 관리
  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((sub) => sub !== streamManager)
    );
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const handleToggle = (kind) => {
    if (publisher) {
      switch (kind) {
        case "camera":
          setIsCamera((prev) => !prev);
          publisher.publishVideo(!isCamera);
          break;

        case "speaker":
          setIsSpeaker((prev) => !prev);
          subscribers.forEach((s) => s.subscribeToAudio(!isSpeaker));
          break;

        case "mike":
          setIsMike((prev) => !prev);
          publisher.publishAudio(!isMike);
          break;

        default:
          break;
      }
    }
  };

  // 토큰 생성 메서드. 실제 해당 세션에 연결
  const createToken = (mySessionId) => {
    return new Promise((resolve, reject) => {
      const data = {};
      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${mySessionId}/connection`,
          data,
          {
            headers: {
              Authorization: `Basic ${btoa(
                `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
              )}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          resolve(res.data.token);
        })
        .catch((error) => reject(error));
    });
  };

  // 세션 연결 상태 업데이트
  const joinSessionWithToken = (token) => {
    const OV = new OpenVidu();

    OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 50,
        threshold: -75,
      },
    });

    const mySession = OV.initSession();
    setSession(mySession);

    mySession.on("streamCreated", (e) => {
      let subscriber = mySession.subscribe(e.stream, undefined);
      console.log(subscriber);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    // 사용자가 화상회의를 떠나면 Session 객체에서 소멸된 stream을 받아와 subscribers 상태값 업뎃
    mySession.on("streamDestroyed", (e) => {
      this.deleteSubscriber(e.stream.streamManager);
    });

    // 서버 측에서 비동기식 오류 발생 시 Session 객체에 의해 트리거되는 이벤트
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    mySession.on("publisherStartSpeaking", (event) => {
      if (userRef.current) {
        for (let i = 0; i < userRef.current.children.length; i++) {
          if (
            JSON.parse(event.connection.data).clientData ===
            userRef.current.children[i].innerText
          ) {
            userRef.current.children[i].style.borderStyle = "solid";
            userRef.current.children[i].style.borderColor = "#1773EA";
          }
        }
      }
      console.log("User " + event.connection.connectionId + " start speaking");
    });

    mySession.on("publisherStopSpeaking", (event) => {
      const clientData = JSON.parse(event.connection.data).clientData;

      if (userRef.current) {
        for (let i = 0; i < userRef.current.children.length; i++) {
          if (clientData === userRef.current.children[i].innerText) {
            userRef.current.children[i].style.borderStyle = "none";
          }
        }
      }

      console.log("User " + event.connection.connectionId + " stop speaking");
    });

    mySession
      .connect(token, {
        clientData: myUserName,
      })
      .then(() => {
        let publisher = OV.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined, // 웹캠 기본 값으로
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: "false",
        });

        mySession.publish(publisher);

        setMainStreamManager(publisher);
        setPublisher(publisher);
      })
      .catch((error) => {
        console.log("세션 연결 오류", error.code, error.message);
      });
  };

  // 소켓 연결 전 socket room 생성
  const createRoom = async (mySessionId, userId) => {
    try {
      const response = await axios.post(CREATEROOM_SERVER_URL, {
        rtcSession: mySessionId,
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

  const handleGamingStart = (status) => {
    setIsWaiting(status);
  };

  const handleMiddleCondition = (status) => {
    setMiddleCon(status);
    setIsGaming((prevIsGaming) => !prevIsGaming);
  };

  let CompMiddleSection;

  switch (middleCon) {
    case 1:
      CompMiddleSection = <RoleSelect middleCon={middleCon} onHandleMiddleCondition={handleMiddleCondition} client={client} sessionId={mySessionId} />;
      break;
    case 2:
      CompMiddleSection = <PlayGame middleCon={middleCon} onHandleMiddleCondition={handleMiddleCondition} client={client} sessionId={mySessionId} />;
      break;
  }

  const divStyle = {
    margin: "0",
    padding: "0",
    height: "100vh",
    overflow: "hidden",
  };

  return (
    <div style={divStyle}>
      {isGaming ? <GamingHeader /> : <Header />}
      {isWaiting ? CompMiddleSection : <RTCViewCenter publisher={publisher} subscribers={subscribers}/> }
      {isWaiting ? <RTCViewLower publisher={publisher} subscribers={subscribers} /> : <WaitingRoomOption isWaiting={isWaiting} onGamingStart={handleGamingStart}/> }
    </div>
  );
};

export default GamePage;
