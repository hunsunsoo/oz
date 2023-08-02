import React, { Component } from "react";
import UserVideoComponent from "./UserVideoComponent";

class SessionManager extends Component {
  render() {
    const {
      session,
      mySessionId,
      myUserName,
      mainStreamManager,
      publisher,
      subscribers,
      isMike,
      isCamera,
      isSpeaker,
      isChat,
    } = this.props;

    return (
      <div>
        {/* 세션이 존재하지 않을 때 */}
        {session === undefined ? (
          <div>세션이 없습니다.</div>
        ) : (
          // 세션이 존재할 때 (화상회의 화면 표시)
          <div>
            <div>
              {/* 이부분은 사용자의 로컬 스트림 화면 */}
              {publisher !== undefined ? (
                <div key={publisher.stream.streamId}>
                  {/* UserVideoComponent는 스트림을 표시하는데 사용되는 컴포넌트입니다. */}
                  <UserVideoComponent streamManager={publisher} />
                </div>
              ) : null}

              {/* 다른 사용자들의 스트림 화면 */}
              {subscribers.map((sub, i) => (
                <div key={sub.stream.streamId}>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>

            {/* 화상회의 참가 인원 초과 시 빈 자리를 검정색 배경화면으로 출력 */}
            {[...Array(4 - subscribers.length)].map((_, i) => (
              <div key={i}>
                <div
                  style={{
                    height: "200px",
                    width: "266px",
                    backgroundColor: "black",
                    marginRight: "50px",
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default SessionManager;
