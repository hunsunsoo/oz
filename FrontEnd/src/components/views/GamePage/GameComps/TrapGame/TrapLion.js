import React, { useState, useEffect } from 'react';

const TrapLion = ({ startData, client, sessionId, userId }) => {

  
  const screen = startData.data.screen;
  const hasKey = startData.data.hasKey;

  const lionMovePublisher = async (type) => {
    if(screen==="wall" && type==="Go"){
      alert("벽으로는 갈 수 없어요");
      return;
    } else{
      try {
        if (!client) {
          console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
          return;
        }
        console.log(userId)
            
        const message = {
          "rtcSession":`${sessionId}`,
          "userId":userId,
          "moving":`${type}`
        };

        client.send('/pub/trap/move', {}, JSON.stringify(message));
        console.log('메시지 보냈음');
      } catch (error) {
        console.log('Error sending message:', error);
      }
    }
  };

  const PicStyle = {
    height: '300px',  //임시크기입니다
    objectFit: 'contain',
  }
  const txtStyle = {
    height: '40px',
    backgroundColor: '#CABE96',
  }

  return(
    <div>
      {hasKey === 1 ? (
          <div style={txtStyle}>
            열쇠를 획득했어~!~! 함정을 피해 도착지점으로 가자~!!
          </div>
        ) : (
          <div style={txtStyle}>
            도착지에 가기전에 열쇠가 필요해! 열쇠와의 거리는 {startData.data.distanceKey}칸 이야.. 함정을 피해 찾아보자
          </div>
        )}
      <div>
        <img src={`image/game/trapGame/${startData.data.screen}.png`} style={PicStyle} />
      </div>
      <button onClick={() => lionMovePublisher("L")}>사자왼쪽으로턴</button>
      <button onClick={() => lionMovePublisher("Go")}>사자이동내가보는방향으로</button>
      <button onClick={() => lionMovePublisher("R")}>사자오른쪽으로턴</button>
    </div>
  );
};

export default TrapLion;