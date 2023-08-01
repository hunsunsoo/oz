import React, { Component } from "react";
import UserVideoComponent from "./UserVideoComponent";

class VideoStreamManager extends Component {
  render() {
    const { subscribers, userRef, publisher, visibleSubscribers, emptySlots } = this.props;
    console.log(subscribers);
    console.log(visibleSubscribers);
    return (
      <div>
        {/* 화상회의가 진행 중일 때 */}
        {subscribers.length > 0 && (
          <div ref={userRef} style={{ display: "flex" }}>
            {/* 로컬 사용자의 스트림 화면 */}
            {publisher !== undefined && (
              <div key={publisher.stream.streamId}>
                <UserVideoComponent streamManager={publisher} />
              </div>
            )}

            {/* 다른 사용자들의 스트림 화면 */}
            {visibleSubscribers.map((sub, i) => (
              <div key={sub.stream.streamId}>
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}

            {/* 화상회의 참가 인원 초과 시 빈 자리를 검정색 배경화면으로 출력 */}
            {[...Array(emptySlots)].map((_, i) => (
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

        {/* 화상회의가 진행 중이 아닐 때 */}
        {subscribers.length === 0 && (
          <div>
            <p>짜잔 화상회의가 실행중입니다.</p>
          </div>
        )}
      </div>
    );
  }
}

export default VideoStreamManager;
