import React, { Component } from "react";
import NumberBoard from "./NumberBoard";
import AlphaBoard from "./AlphaBoard";

const compStyle = { // 실질적인 component부분
width: "90%",
height: "95%",
padding: "2.5% 5%",
}

const backgroundDiv = { // 배경먹이고
width: "100%",
height: "90%",
background: `url('/stage1Background.png')`, // 이미지 경로를 여기에 입력하세요.
backgroundSize: "cover",
backgroundPosition: "center",
padding: "0",
}

const BoardStyle = { // 숫자판, 알파벳판
    position: 'absolute',
    top: '40%',
    left: '50%',
    margin: '-150px 0 0 -150px'
  };

// 게임방법 아이콘 스타일
const iconStyle = {
position: "absolute",
top: "55%", // 하단 여백
left: "7.5%", // 좌측 여백
width: "50px", // 아이콘의 너비
height: "50px", // 아이콘의 높이
};

// 조력자 제출 스타일
const subBtnSttyle = {
    position: "absolute",
    top: "55%", // 하단 여백
    right: "7.5%", // 좌측 여백
    width: "100px", // 아이콘의 너비
    height: "50px", // 아이콘의 높이
    };

// export class 


const GameComp_1_11 = () => {
    return (
      <div style={compStyle}>
        <div style={backgroundDiv}>
          <div style={BoardStyle}>
            <NumberBoard />
          </div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
        </div>
      </div>
    );
  };
  
  const GameComp_1_12 = () => {
    return (
      <div style={compStyle}>
        <div style={backgroundDiv}>
          <div style={BoardStyle}>
            <AlphaBoard />
          </div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
          <img src="/stage1SubBtn.png" alt="stage1SubBtn" style={subBtnSttyle} />
        </div>
      </div>
    );
  };
  
  export { GameComp_1_11, GameComp_1_12 };
  

