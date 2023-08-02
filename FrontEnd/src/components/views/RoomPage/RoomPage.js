import React, { Component } from "react";
import Header from "../Header/Header";
import OpenViduComponent from "../OpenViduComponent"


class RoomPage extends Component {
  render() {
    const sessionID = "123456";

    return (
      <div style={{height: "100vh"}}>
        <Header/>
        <div style={{background:"#DDE5B6", height: "60%"}}>
          <div style={{width: "100%", height: "100%"}}>
            {/* WebRTC랑 Chat */}
            {/* 비디오 마이크 옵션 */}
            <OpenViduComponent session={sessionID} isStart={false}/>
          </div>
          <div>
            {/* 버튼*/}
          </div>
        </div>
      </div>
    )
  }
}

export default RoomPage;
