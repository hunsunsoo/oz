import React, { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import RTCViewLower from "./RTCViewLower";
import RTCViewCenter from "./RTCViewCenter";
import Stomp from "stompjs";
import axios from "axios";
import Header from "../Header/Header";
import GamingHeader from "../Header/GamingHeader";
import RoleSelect from "./RoleSelect";
import PlayGame from "./PlayGame";

import WaitingRoomOption from "./WaitingRoomOption";
import {
  OPENVIDU_SERVER_URL,
  OPENVIDU_SERVER_SECRET,
  SERVER_URL,
  WEBSOCKET_SERVER_URL,
} from "../../../_actions/urls";

const GamePage = () => {
  //대기방 브라우저 컨트롤
  useEffect(() => {
    //뒤로가기 막기
    // window.history.pushState(null, null, window.location.href);
    // window.onpopstate = function (event) {
    //   window.history.pushState(null, null, window.location.href);
    // };

    //새로고침 막기
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "새로고침 시, 데이터가 손실되며 게임이 중단될 수 있습니다. 그래도 나가시겠습니까?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // 컴포넌트 조건부 렌더링
  const [isGaming, setIsGaming] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [middleCon, setMiddleCon] = useState(1);

  // 세션 아이디 추출
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionIdFromURL = params.get("SessionId");
  const host = params.get("host");

  // jwt payload decode
  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );
  var base64Url = accessToken.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jwtPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  const JsonPayload = JSON.parse(jwtPayload);

  const [mySessionId, setMySessionId] = useState(sessionIdFromURL || "DEFAULT");
  const [amIHost, setAmIHost] = useState(host);
  const [myRole, setMyRole] = useState(0);
  const [roundId, setRoundId] = useState(0);

  // RTC를 위한 state
  const [myUserName, setMyUserName] = useState(JsonPayload.nickname);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [isMike, setIsMike] = useState(true);
  const [isCamera, setIsCamera] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isChat, setIsChat] = useState(false);

  // Socket을 위한 state
  const [UserId, setuserId] = useState(JsonPayload.userId);
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
    if (amIHost == 0) {
      socketConnect();
    } else {
      createRoom(mySessionId, UserId);
    }
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

  const handleMikeToggle = (status) => {
    setIsMike(status);
    publisher.publishAudio(status);
  };
  const handleCameraToggle = (status) => {
    setIsCamera(status);
    publisher.publishVideo(status);
  };
  const handleSpeakerToggle = (status) => {
    setIsSpeaker(status);
    subscribers.forEach((s) => s.subscribeToAudio(status));
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
      const response = await axios.post(SERVER_URL + "/socket/room", {
        rtcSession: mySessionId,
        userId: userId,
      });

      if (response.status !== 200) {
        throw new Error(
          "방 생성에 실패하였습니다. 서버 상태 코드 / 세션Id를 확인하세요"
        );
      }
      console.log("방 생성에 성공하였습니다. 소켓 연결을 시작합니다.");

      socketConnect(); // 방 생성 성공 후 소켓 연결 시작
    } catch (error) {
      console.error("Error creating a room:", error);
    }
  };

  // WebSocket Server 연결
  const socketConnect = () => {
    let newClient = Stomp.client(WEBSOCKET_SERVER_URL);
    newClient.debug = null; // 디버그 메시지 비활성화 null, 활성화 console.log

    // 연결 성공시 구독을 위한 isConnect state 갱신
    const onConnect = () => {
      console.log("웹소켓 연결완료");
      setIsConnect(true);

      axios
        .post(SERVER_URL + "/socket/session", {
          rtcSession: mySessionId,
          userId: UserId,
        })
        .then((response) => {
          console.log(response.data);
        });
    };

    const onError = (error) => {
      console.error("웹소켓 연결 error:", error);
    };

    newClient.connect({}, onConnect, onError);

    setClient(newClient);

    return () => {
      newClient.disconnect();
    };
  };

  const handleGamingStart = (status) => {
    setIsWaiting(status);
  };

  // roundId 콜백 함수
  const handleRoundId = (status) => {
    setRoundId(status);
  };

  const handleMiddleCondition = (status) => {
    setMiddleCon(status);
    setIsGaming((prevIsGaming) => !prevIsGaming);
  };

  const handleMyRole = (status) => {
    setMyRole(status);
  };

  let CompMiddleSection;

  switch (middleCon) {
    case 1:
      CompMiddleSection = (
        <RoleSelect
          middleCon={middleCon}
          onHandleMyRole={handleMyRole}
          onHandleRoundId={handleRoundId}
          onHandleMiddleCondition={handleMiddleCondition}
          client={client}
          sessionId={mySessionId}
          userId={JsonPayload.userId}
          host={host}
        />
      );
      break;
    case 2:
      CompMiddleSection = (
        <PlayGame
          middleCon={middleCon}
          onHandleMiddleCondition={handleMiddleCondition}
          client={client}
          sessionId={mySessionId}
          myRole={myRole}
          userId={JsonPayload.userId}
          roundId={roundId}
          onHandleMike={handleMikeToggle}
          onHandleCamera={handleCameraToggle}
          onHandleSpeaker={handleSpeakerToggle}
        />
      );
      break;
  }

  const divStyle = {
    margin: "0",
    padding: "0",
    height: "100vh",
    overflow: "hidden",
    background: `url(${process.env.PUBLIC_URL}/image/backGround/backgroundUser.png)`,
    backgroundSize: 'cover', // 이미지가 요소에 맞게 크기 조절
    backgroundRepeat: 'no-repeat', // 이미지 반복 없음
    backgroundPosition: 'center', // 이미지 중앙 배치
  };

  return (
    <div style={divStyle}>
      {isGaming ? <GamingHeader myRole={myRole} /> : <Header />}
      {isWaiting ? (
        CompMiddleSection
      ) : (
        <RTCViewCenter
          publisher={publisher}
          subscribers={subscribers}
          client={client}
          sessionId={mySessionId}
          userId={UserId}
          myNickname={myUserName}
        />
      )}
      {isWaiting ? (
        <RTCViewLower publisher={publisher} subscribers={subscribers} />
      ) : (
        <WaitingRoomOption
          isWaiting={isWaiting}
          onGamingStart={handleGamingStart}
          userId={UserId}
          sessionId={mySessionId}
          amIHost={amIHost}
          client={client}
          handleToggle={handleToggle}
          isMike={isMike}
          isCamera={isCamera}
          isSpeaker={isSpeaker}
          onHandleMike={handleMikeToggle}
          onHandleCamera={handleCameraToggle}
          onHandleSpeaker={handleSpeakerToggle}
        />
      )}
    </div>
  );
};

export default GamePage;
