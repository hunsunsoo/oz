import React from 'react';
import OpenViduComponent from '../OpenViduComponent';

const FriendsRTC = () => {
    const session = undefined;
    const sessionId = "123456"; // 원하는 세션 ID 값
    const userName = "donghun"; // 사용자 이름
    const isStart = true; // 비디오 회의 시작 여부

    return (
        <div style={{background:"#DDE5B6", height: "60%"}}>
            <OpenViduComponent
                session = {session}
                sessionId={sessionId}
                isStart={isStart}
                myUserName={userName}
            />
        </div>
    );
};


export default FriendsRTC;
