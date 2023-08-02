import React from 'react';
import Header from "../Header/Header.js"
import RoleSelect from '../../RoleSelect.js';
import FriendsRTC from '../Footer/FriendsRTC';
import { GameComp_1_11, GameComp_1_12 } from './GamePlay';

const GamePlayPage = () => {
  const isState = 2;
    
  let componentToRender;

  switch (isState) {
    case 1:
      componentToRender = <GameComp_1_11 />;
      break;
    case 2:
      componentToRender = <GameComp_1_12 />;
      break;
    // Add more cases as needed for other conditions
    default:
      componentToRender = null; // Render nothing if no condition matches
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
        {/* <FriendsRTC/> */}
      </div>
  );
};

export default GamePlayPage;

  