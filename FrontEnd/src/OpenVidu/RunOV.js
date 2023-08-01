import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
// import styled from "styled-components";
import UserVideoComponent from "./UserVideoComponent";
// import ChatBox from "./Chat/ChatBox";

// 로컬 미디어 서버 주소
const OPENVIDU_SERVER_URL = "https://i9b104.p.ssafy.io";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";



class RunOV extends Component {
  render() {
    const { subscribers } = this.state;
    // 최대 4명까지만 처리하도록 제한
    const visibleSubscribers = subscribers.slice(0, 3);
    // 나머지 빈 자리 개수 계산
    const emptySlots = 3 - visibleSubscribers.length;

    return (
      <div>
        <div>
          <div style={{height:"400px"}}> Oz의 마법사 </div>
        </div>
        <div>
          {this.state.session === undefined ? ( // 세션이 존재하지 않는다 = 방을 입장 안했을 때 join버튼이 나옴
          // 근데 방만들기와 방 접속하기 따로만들어야함
            <div
              style={{
                position: "absolute",
                right: "0",
                left: "0",
                width: "300px",
                margin: "auto",
                height: "300px",
              }}
              id="join"
            >
              <div>
                <h1 style={{ color: "white" }}> Join a video session </h1>
                <div>
                  <input
                    type="text"
                    placeholder="Enter Session ID"
                    value={this.state.mySessionId}
                    onChange={this.handleSessionIdChange}
                  />
                  <button onClick={this.handleCreateSession}>방 만들기</button>
                  <button onClick={this.handleJoinSession}>방 접속하기</button>
                </div>
              </div>
            </div>
          ) : ( // 이부분은 세션이 있다 = 원래카면 게임화면 띄워주는 부분 -> 컴포넌트화 된 게임화면 띄워주면 될듯
            <div>
              짜잔 화상회의가 실행중입니다.
            </div>
          )}
          <div>
            <div>
              {this.state.session !== undefined ? (
                <div
                  // primary={this.state.isChat}
                  ref={this.userRef}
                  style={{display:"flex"}}
                >
                  {this.state.publisher !== undefined ? (
                    <div key={this.state.publisher.stream.streamId}>
                      <UserVideoComponent
                        streamManager={this.state.publisher}
                      />
                    </div>
                  ) : null}
                  {visibleSubscribers.map((sub, i) => (
                    <div key={sub.stream.streamId}>
                      <UserVideoComponent streamManager={sub} />
                    </div>
                  ))}

                  {/* 빈 자리를 검정색 배경화면으로 출력 */}
                  {[...Array(emptySlots)].map((_, i) => (
                    <div>
                      <div style={{height:"200px", width:"266px", backgroundColor:"black", marginRight:"50px"}}></div>
                      {console.log(emptySlots)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {/* <div primary={this.state.isChat}>
            <div>
              <ChatBox />
            </div>
          </div> */}
        </div>
      </div>


    )
  }
  constructor(props) {
    super(props);
    this.userRef = React.createRef();

    this.state = {
      mySessionId: "DEFAULT", // 세션아이디는 일단은 디폴트값으로줬음. 방을 만들거나, 방에 접속할 때 입력한 값으로 갱신된 후에 방에 들어갈 수 있도록.. 접속하기인데 방이없다면 거절메시지
      myUserName: "Participant" + Math.floor(Math.random() * 100), // 회원가입시 받은 닉네임 들어가면 좋을듯
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined, // 로컬 웹캠 스트림
      subscribers: [], // 다른 사용자의 활성 스트림
      isMike: true,
      isCamera: true,
      isSpeaker: true,
      isChat: false,
    };

    this.joinSessionWithToken = this.joinSessionWithToken.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.checkSessionCapacity = this.checkSessionCapacity.bind(this);
    this.createSessionAndToken = this.createSessionAndToken.bind(this);
    this.checkSessionExist = this.checkSessionExist.bind(this);
    
  }

  componentDidMount() {
    // this.leaveSession();
    window.addEventListener("beforeunload", this.onbeforeunload);
    // 스터디방에서 화상회의 입장 -> props로 roomId로 받으면 세션id 업뎃 user 정보 전역변수 가져옴 -> 상태값 업뎃
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(e) {
    this.leaveSession();
  }

  // 화상회의 나갈때
  leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: undefined,
      myUserName: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({ subscribers: subscribers });
    }
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({ mainStreamManager: stream });
    }
  }

  handleSessionIdChange = (event) => {
    // 세션 ID 입력값이 변경될 때마다 상태 업데이트
    this.setState({ mySessionId: event.target.value });
  };

  handleCreateSession = () => {
    // 방 만들기 버튼 클릭 시 실행되는 함수
    this.createSessionAndToken();
  };
  
  handleJoinSession = () => {
    // 방 접속하기 버튼 클릭 시 실행되는 함수
    this.checkSessionExist()
    
  };

  handleToggle(kind) {
    if (this.state.publisher) {
      switch (kind) {
        case "camera":
          this.setState({ isCamera: !this.state.isCamera }, () => {
            console.log(this.state.publisher);
            this.state.publisher.publishVideo(this.state.isCamera);
          });
          break;

        case "speaker":
          this.setState({ isSpeaker: !this.state.isSpeaker }, () => {
            this.state.subscribers.forEach((s) =>
              s.subscribeToAudio(this.state.isSpeaker)
            );
          });
          break;

        case "mike":
          this.setState({ isMike: !this.state.isMike }, () => {
            this.state.publisher.publishAudio(this.state.isMike);
          });
          break;
      }
    }
  }

  createSessionAndToken = () => {
    this.createSession(this.state.mySessionId)
      .then((sessionId) => this.createToken(sessionId))
      .then((token) => {
        this.checkSessionCapacity(token);
      })
      .catch((error) => {
        console.log("세션 연결 오류", error);
      });
  };

  checkSessionExist = () => {
    axios
      .get(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${this.state.mySessionId}`, {
        headers: {
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
        },
      })
      .then((response) => {
        this.getToken().then((token) => this.checkSessionCapacity(token));
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          // 세션 존재 확인 실패 (404 상태코드)
          // 세션이 존재하지 않으므로, 사용자에게 방이 존재하지 않음을 알리고 추가 작업을 수행하세요.
          alert("해당 세션 아이디로 생성된 방이 존재하지 않습니다. 다른 세션 아이디를 입력해주세요.");
          // 추가 작업을 수행하거나, 입력 폼을 초기화하는 등의 로직을 진행합니다.
          // 예시로 세션 아이디를 초기화하고, 사용자가 새로운 세션 아이디를 입력할 수 있도록 폼을 초기화하면:
          this.setState({ mySessionId: "" });
        } else {
          // 다른 오류가 발생한 경우에 대한 처리
          console.log("방 정보를 가져오는데 실패하였습니다.", error);
        }
      });
  };

  checkSessionCapacity = (token) => {
    axios
      .get(`${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${this.state.mySessionId}/connection`, {
        headers: {
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
        },
      })
      .then((response) => {
        const participantCount = response.data.numberOfElements;
        console.log(participantCount)
        if (participantCount > 4) {
          alert("방에 최대 참가 인원(4명)을 초과하였습니다. 입장이 불가능합니다.");
        } else {
          this.joinSessionWithToken(token);
        }
      })
      .catch((error) => {
        console.log("방 정보를 가져오는데 실패하였습니다.", error);
      });
  };

  joinSessionWithToken = (token) => {
    this.OV = new OpenVidu(); // OpenVidu 객체를 얻음
  
    this.OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 50,
        threshold: -75,
      },
    });
  
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        let mySession = this.state.session;
  
        // Session 객체가 각각 새로운 stream에 대해 구독 후, subscribers 상태값 업뎃
        mySession.on("streamCreated", (e) => {
          // OpenVidu -> Session -> 102번째 줄 확인 UserVideoComponent를 사용하기 때문에 2번째 인자로 HTML
          // 요소 삽입X
          let subscriber = mySession.subscribe(e.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);
  
          this.setState({ subscribers });
  
          console.log(subscribers);
        });
  
        // 사용자가 화상회의를 떠나면 Session 객체에서 소멸된 stream을 받아와 subscribers 상태값 업뎃
        mySession.on("streamDestroyed", (e) => {
          this.deleteSubscriber(e.stream.streamManager);
        });
  
        // 서버 측에서 비동기식 오류 발생 시 Session 객체에 의해 트리거되는 이벤트
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });
  
        // 발언자 감지
        mySession.on("publisherStartSpeaking", (event) => {
          for (let i = 0; i < this.userRef.current.children.length; i++) {
            if (
              JSON.parse(event.connection.data).clientData ===
              this.userRef.current.children[i].innerText
            ) {
              this.userRef.current.children[i].style.borderStyle = "solid";
              this.userRef.current.children[i].style.borderColor = "#1773EA";
            }
          }
          console.log(
            "User " + event.connection.connectionId + " start speaking"
          );
        });
  
        mySession.on("publisherStopSpeaking", (event) => {
          console.log(
            "User " + event.connection.connectionId + " stop speaking"
          );
          for (let i = 0; i < this.userRef.current.children.length; i++) {
            if (
              JSON.parse(event.connection.data).clientData ===
              this.userRef.current.children[i].innerText
            ) {
              this.userRef.current.children[i].style.borderStyle = "none";
            }
          }
        });
  
        mySession
          .connect(token, {
            clientData: this.state.myUserName,
          })
          .then(() => {
            let publisher = this.OV.initPublisher(undefined, {
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
  
            this.setState({ mainStreamManager: publisher, publisher });
          })
          .catch((error) => {
            console.log("세션 연결 오류", error.code, error.message);
          });
      }
    );
  };

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({ customSessionId: sessionId });

      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization: `Basic ${btoa(
              `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
            )}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          resolve(res.data.id);
        })
        .catch((res) => {
          let error = Object.assign({}, res);

          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else if (
            window.confirm(
              'No connection to OpenVidu Server. This may be a certificate error at "' +
                OPENVIDU_SERVER_URL +
                '"\n\nClick OK to navigate and accept it. If no certifica' +
                "te warning is shown, then check that your OpenVidu Server is up and running at" +
                ' "' +
                OPENVIDU_SERVER_URL +
                '"'
            )
          ) {
            window.location.assign(OPENVIDU_SERVER_URL + "/accept-certificate");
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      let data = {};

      axios
        .post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
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
          resolve(res.data.token);
        })
        .catch((error) => reject(error));
    });
  }

}

export default RunOV;
