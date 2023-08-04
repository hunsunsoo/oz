import React from "react";
import UserVideoWaitingRoom from './UserVideoWaitingRoom';
import style from "./RTCViewCenter.module.css";

const RTCViewCenter = ({ publisher, subscribers }) => {
    const visibleSubscribers = subscribers.slice(0, 3);
    const emptySlots = 3 - visibleSubscribers.length;
  
    const RTCStyle = {
      backgroundColor: '#DDE5B6',
      height: '70%',
      display: 'flex',
    };
  
    return (
        <div style={RTCStyle}>
            <div className={style.videoPage}>
                {publisher !== undefined ? (
                    <div className={style.videoBox} key={publisher.stream.streamId} >
                        <div className={style.nickBox}><p>닉네임</p></div>
                        <UserVideoWaitingRoom streamManager={publisher} />
                    </div>
                ) : null}
                {visibleSubscribers.map((sub, i) => (
                    <div className={style.videoBox} key={sub.stream.streamId} >
                        <div className={style.nickBox}><p>닉네임</p></div>
                        <UserVideoWaitingRoom streamManager={sub} />
                    </div>
                ))}
                {[...Array(emptySlots)].map((_, i) => (
                    <div className={style.videoBox} >
                        <div className={style.nickBox}><p>닉네임</p></div>
                        <div className={style.emptySlot}></div>
                    </div>
                    
                ))}
            </div>
            <div className={style.chatPage}>
                이곳은 채팅이 뜰 곳입니다.
            </div>
        </div>
    );
  };
  
  export default RTCViewCenter;