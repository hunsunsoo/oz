import React from "react";
import UserVideoWaitingRoom from './UserVideoWaitingRoom';

const RTCViewCenter = ({ publisher, subscribers }) => {
    const visibleSubscribers = subscribers.slice(0, 3);
    const emptySlots = 3 - visibleSubscribers.length;
  
    const RTCStyle = {
      backgroundColor: '#DDE5B6',
      height: '70%',
      display: 'flex',
    };
      
    
    const leftPaneStyle = {
        flex: '0 0 60%', // 60% width for the left pane
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns with equal width
        gridTemplateRows: 'repeat(2, 1fr)', // 2 rows with equal height
        gap: '8px', // Gap between grid items (adjust as needed)
        alignItems: 'center', // Center items vertically
        justifyContent: 'center', // Center items horizontally
    };
    
    const emptySlotStyle = {
        height: '250px',
        width: '290px',
        backgroundColor: 'black',
  
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };

    const videoBoxStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      };
  
    return (
        <div style={RTCStyle}>
            <div style={leftPaneStyle}>
            {publisher !== undefined ? (
                <div className="videoBox" key={publisher.stream.streamId} style={videoBoxStyle} >
                <UserVideoWaitingRoom streamManager={publisher} />
                </div>
            ) : null}
            {visibleSubscribers.map((sub, i) => (
                <div className="videoBox" key={sub.stream.streamId} style={videoBoxStyle} >
                <UserVideoWaitingRoom streamManager={sub} />
                </div>
            ))}
            {[...Array(emptySlots)].map((_, i) => (
                <div className="videoBox" style={videoBoxStyle} >
                <div style={emptySlotStyle}></div>
                </div>
                
            ))}
            </div>
            <div style={{ flex: '0 0 40%' , backgroundColor:'pink'}}>
                이곳은 채팅이 뜰 곳입니다.
            </div>
        </div>
    );
  };
  
  export default RTCViewCenter;