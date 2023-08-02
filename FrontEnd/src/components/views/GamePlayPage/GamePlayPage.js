import React from 'react';
import Header from "../Header/Header.js"
import RoleSelect from '../../RoleSelect.js';
import FriendsRTC from '../Footer/FriendsRTC';
import { GameComp_1_11, GameComp_1_12 } from './GamePlay';

const GamePlayPage = () => {
  const isState = 1;
  const isIndex = 3;
    
  let componentToRender;

  switch (isState) {
    case 0: // 이게 스테이지 구분 (0-1)
      switch (isIndex) { // 이게 인덱스 구분
        case 1: 
          componentToRender = null;
          break;
        case 2:
          componentToRender = null;
          break;
        case 3:
          componentToRender = null;
          break; 
      }
    case 1: // 이게 스테이지 구분 (1-1)
      switch (isIndex) { // 이게 인덱스 구분
        case 1: 
          componentToRender = null;
          break;
        case 2:
          componentToRender = null;
          break;
        case 3:
          componentToRender = <GameComp_1_12 />;
          break; 
      }
    case 2: // 이게 스테이지 구분 (2-1)
      switch (isIndex) { // 이게 인덱스 구분
        case 1: 
          componentToRender = null;
          break;
        case 2:
          componentToRender = <GameComp_1_12 />;
          break;
        case 3:
          componentToRender = <GameComp_1_12 />;
          break; 
      }
  }

  const divStyle = { // header, rtc 포함된 전체 div
    margin: '0',
    padding: '0',
    height: '100vh',
    overflow: 'hidden', /* 스크롤 막기 */
  };

  const bodyStyle = { // body 부분 (배경색상용)
    width: "100%",
    height: "60%",
    backgroundColor: "#DDE5B6"
  }

  return (
      <div style={divStyle}>
        <Header />
        <div style={bodyStyle}>
          {componentToRender}
        </div>
        <FriendsRTC/>
      </div>
  );
};

export default GamePlayPage;

  