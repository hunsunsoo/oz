import React, { Component } from "react";

class VideoSessionUI extends Component {
  render() {
    const {
      session,
      mySessionId,
      handleSessionIdChange,
      handleCreateSession,
      handleJoinSession,
    } = this.props;

    return (
      <div>
        {session === undefined ? (
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
              <h1 style={{ color: "white" }}>Join a video session</h1>
              <div>
                <input
                  type="text"
                  placeholder="Enter Session ID"
                  value={mySessionId}
                  onChange={handleSessionIdChange}
                />
                <button onClick={handleCreateSession}>방 만들기</button>
                <button onClick={handleJoinSession}>방 접속하기</button>
              </div>
            </div>
          </div>
        ) : (
          <div>짜잔 화상회의가 실행중입니다.</div>
        )}
      </div>
    );
  }
}

export default VideoSessionUI;
