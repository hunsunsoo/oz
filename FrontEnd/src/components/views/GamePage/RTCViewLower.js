import React from "react";
import UserVideoComponent from '../../../OpenVidu/UserVideoComponent';

const RTCViewLower = ({ publisher, subscribers }) => {
  const visibleSubscribers = subscribers.slice(0, 3);
  const emptySlots = 3 - visibleSubscribers.length;

  return (
    <div style={{display:"flex"}}>
    {publisher !== undefined ? (
        <div key={publisher.stream.streamId}>
        <UserVideoComponent streamManager={publisher} />
        </div>
    ) : null}
    {visibleSubscribers.map((sub, i) => (
        <div key={sub.stream.streamId}>
        <UserVideoComponent streamManager={sub} />
        </div>
    ))}
    {[...Array(emptySlots)].map((_, i) => (
        <div>
        <div style={{height:"200px", width:"266px", backgroundColor:"black", marginRight:"50px"}}></div>
        </div>
    ))}
    </div>
  );
};

export default RTCViewLower;