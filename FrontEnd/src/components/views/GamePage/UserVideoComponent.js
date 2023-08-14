import React, { useEffect, useRef } from "react";

const UserVideoComponent = ({ streamManager }) => {
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
      <video
        ref={videoRef}
        autoPlay
        style={{
          marginTop: "5px",
          width: "240px",
          height: "180px",
          backgroundColor: "black",
        }}
      />
    </div>
  );
};

export default UserVideoComponent;