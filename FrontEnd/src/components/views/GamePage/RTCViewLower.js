import React from "react";
import UserVideoComponent from '../../../OpenVidu/UserVideoComponent';

const RTCViewLower = ({ publisher, subscribers }) => {
  const visibleSubscribers = subscribers.slice(0, 3);
  const emptySlots = 3 - visibleSubscribers.length;

  const RTCStyle = {
    backgroundColor: '#d2cea2',
    height: '30%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  };

  return (
    <div style={RTCStyle}>
      {publisher !== undefined ? (
          <div className="videoBox" key={publisher.stream.streamId}>
            <UserVideoComponent streamManager={publisher} />
          </div>
      ) : null}
      {visibleSubscribers.map((sub, i) => (
          <div className="videoBox" key={sub.stream.streamId}>
            <UserVideoComponent streamManager={sub} />
          </div>
      ))}
      {[...Array(emptySlots)].map((_, i) => (
          <div style={{height:"200px", width:"266px", backgroundColor:"black"}}></div>
      ))}
    </div>
  );
};

export default RTCViewLower;