import React, { useState, useEffect, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import { useLocation } from "react-router-dom";
import RTCViewLower from "./RTCViewLower";
import axios from "axios";
import Header from "../Header/Header";
import GamingHeader from "../Header/GamingHeader";
import RoleSelect from "./RoleSelect";
import PlayGame from "./PlayGame";

const GamePage = () => {
  // 헤더 컴포넌트 조건부 렌더링 - 게임시작전에는 false, 게임시작 후에는 true
  const [isGaming, setIsGaming] = useState(false);

  // 세션 아이디 추출
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionIdFromURL = params.get("SessionId");

  const OPENVIDU_SERVER_URL = "https://i9b104.p.ssafy.io:8443";
  const OPENVIDU_SERVER_SECRET = "MY_SECRET";

  // RTC를 위한 state
  const [mySessionId, setMySessionId] = useState(sessionIdFromURL || "DEFAULT");
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

  const userRef = useRef(null);

  // 페이지 생성시 접속 요청
  useEffect(() => {
    createToken(mySessionId)
      .then((token) => {
        joinSessionWithToken(token);
      })
      .catch((error) => {
        console.error("Error creating token:", error);
      });
  }, [mySessionId]);

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

  const divStyle = {
    margin: "0",
    padding: "0",
    height: "100vh",
    overflow: "hidden",
  };

  return (
    <div style={divStyle}>
      {isGaming ? <GamingHeader /> : <Header />}
      {/* <RoleSelect /> */}
      <PlayGame />
      <RTCViewLower publisher={publisher} subscribers={subscribers} />
    </div>
  );
};

export default GamePage;
