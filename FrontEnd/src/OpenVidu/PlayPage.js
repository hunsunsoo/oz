import React, { Component } from "react";
import VideoSessionUI from "./VideoSessionUI";
import SessionManager from "./SessionManager";
import VideoStreamManager from "./VideoStreamManager";
import axios from "axios";
import { OpenVidu } from "openvidu-browser";

const OPENVIDU_SERVER_URL = "https://i9b104.p.ssafy.io";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

class PlayPage extends Component {
  constructor(props) {
    super(props);
    this.userRef = React.createRef();

    this.state = {
      mySessionId: "",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
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
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(e) {
    this.leaveSession();
  }

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
    this.setState({ mySessionId: event.target.value });
  };

  handleCreateSession = () => {
    this.createSessionAndToken();
  };

  handleJoinSession = () => {
    this.checkSessionExist();
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
      .get(
        `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${this.state.mySessionId}`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
            )}`,
          },
        }
      )
      .then((response) => {
        this.getToken().then((token) => this.checkSessionCapacity(token));
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          alert(
            "해당 세션 아이디로 생성된 방이 존재하지 않습니다. 다른 세션 아이디를 입력해주세요."
          );
          this.setState({ mySessionId: "" });
        } else {
          console.log("방 정보를 가져오는데 실패하였습니다.", error);
        }
      });
  };

  checkSessionCapacity = (token) => {
    axios
      .get(
        `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${this.state.mySessionId}/connection`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
            )}`,
          },
        }
      )
      .then((response) => {
        const participantCount = response.data.numberOfElements;
        console.log(participantCount);
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
    this.OV = new OpenVidu();
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

        mySession.on("streamCreated", (e) => {
          let subscriber = mySession.subscribe(e.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          this.setState({ subscribers });
          console.log(subscribers);
        });

        mySession.on("streamDestroyed", (e) => {
          this.deleteSubscriber(e.stream.streamManager);
        });

        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

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
              videoSource: undefined,
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
                '"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server is up and running at' +
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

  render() {
    const { session, subscribers } = this.state;
    const visibleSubscribers = subscribers.slice(0, 3);
    const emptySlots = 3 - visibleSubscribers.length;

    return (
      <div>
        <VideoSessionUI
          session={session}
          mySessionId={this.state.mySessionId}
          handleSessionIdChange={this.handleSessionIdChange}
          handleCreateSession={this.handleCreateSession}
          handleJoinSession={this.handleJoinSession}
        />
        <SessionManager
          session={session}
          mySessionId={this.state.mySessionId}
          myUserName={this.state.myUserName}
          mainStreamManager={this.state.mainStreamManager}
          publisher={this.state.publisher}
          subscribers={this.state.subscribers}
          isMike={this.state.isMike}
          isCamera={this.state.isCamera}
          isSpeaker={this.state.isSpeaker}
          isChat={this.state.isChat}
          handleToggle={this.handleToggle}
          leaveSession={this.leaveSession}
          userRef={this.userRef}
        />
        {session !== undefined ? (
          <VideoStreamManager
            publisher={this.state.publisher}
            visibleSubscribers={visibleSubscribers}
            emptySlots={emptySlots}
            userRef={this.userRef}
          />
        ) : null}
      </div>
    );
  }
}

export default PlayPage;
