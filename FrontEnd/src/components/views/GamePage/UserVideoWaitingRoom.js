import React, { useEffect, useRef } from "react";
import style from "./UserVideoWaitingRoom.module.css";

const UserVideoWaitingRoom = ({ streamManager }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (streamManager !== undefined && videoRef.current !== null) {
      // 스트림 매니저의 스트림을 video 요소에 추가
      streamManager.addVideoElement(videoRef.current);
    }

    return () => {
      if (streamManager !== undefined && videoRef.current !== null) {
        // 컴포넌트가 언마운트되면 스트림 매니저에서 video 요소를 제거
        streamManager.removeVideoElement(videoRef.current);
      }
    };
  }, [streamManager]);

  return (
    <div>
      {/* 스트림을 표시하는 video 요소 */}
      <video className={style.userVideo}
        ref={videoRef}
        autoPlay
      />
    </div>
  );
};

export default UserVideoWaitingRoom;