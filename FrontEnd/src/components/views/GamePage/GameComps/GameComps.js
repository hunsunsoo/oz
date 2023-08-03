import React from "react";
import { NumberBoard, AlphaBoard, MathBoard, AnsBoard, MiroRed, MiroGreen } from "./Board";

const compStyle = { // 실질적인 component부분
  width: "90%",
  height: "95%",
  padding: "2.5% 5%",
}

const iconStyle = { // 게임방법 아이콘 스타일
  position: "absolute",
  top: "55%", // 하단 여백
  left: "7.5%", // 좌측 여백
  width: "50px", // 아이콘의 너비
  height: "50px", // 아이콘의 높이
};


// 1스테이지 게임
const backgroundDiv1 = { // 1스테이지 배경
width: "100%",
height: "90%",
background: `url('/stage1Background.png')`,
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

const BoardStyle2 = { // 정답제출 숫자판 (삭제 할 수 있으면 삭제)
  position: 'absolute',
  top: '40%',
  left: '30%',
  margin: '-150px 0 0 -150px'
};

const MathBoardStyle = { // 사칙연산 판
  position: 'absolute',
  top: '42%',
  left: '60%',
  margin: '-150px 0 0 -150px'
};

const AnsBoardStyle = { // 정답제출 판
  position: 'absolute',
  top: '62%',
  left: '60%',
  margin: '-150px 0 0 -150px'
};

const equal = { // ' = ' 아이콘 스타일
  position: "absolute",
  top: "55%", // 하단 여백
  right: "45%", // 좌측 여백
  width: "50px", // 아이콘의 너비
  height: "50px", // 아이콘의 높이
};

const subBtnSttyle = { // 조력자 제출 스타일
  position: "absolute",
  top: "55%", // 하단 여백
  right: "7.5%", // 좌측 여백
  width: "100px", // 아이콘의 너비
  height: "50px", // 아이콘의 높이
};

const ansSubmitBtn = { // 정답 제출 스타일
  position: "absolute",
  top: "24%", // 하단 여백
  right: "33%", // 좌측 여백
  width: "130px",
  height: "60px",
  backgroundColor: "#A98467",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#F0EAD2",
  borderRadius: "20px",
};

const resetBtn = { // 리셋 버튼 스타일
  position: "absolute",
  top: "24%", // 하단 여백
  right: "25%", // 좌측 여백
  width: "110px",
  height: "60px",
  backgroundColor: "#A98467",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#F0EAD2",
  borderRadius: "20px",
};

const rectangleStyle = { // 문제(숫자)
  position: "absolute",
  top: "53%", // 하단 여백
  right: "26%", // 좌측 여백
  width: "200px",
  height: "80px",
  backgroundColor: "#A98467",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "40px",
  fontWeight: "bold",
  color: "#F0EAD2",
  borderRadius: "20px",
};


// 2스테이지 게임
const backgroundDiv2 = { // 2스테이지 배경
  width: "100%",
  height: "90%",
  background: `url('/stage2Background.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "0",
}

const lionview = { // 사자 시야
  position: "absolute",
  top: "40%", // 하단 여백
  left: "50%", // 좌측 여백
  width: "600px",
  height: "270px",
  backgroundColor: "red",
  margin: '-150px 0 0 -300px'
};

const dist = { // 열쇠까지 거리
  position: "absolute",
  top: "59%",
  left: "41%",
  width: "280px",
  height: "46px",
  backgroundColor: "#6C584C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "17px",
  color: "#F0EAD2",
  borderRadius: "20px",
}

const liondir = { // 사자 화살표
  position: "absolute",
  top: "45%", // 하단 여백
  left: "15%", // 좌측 여백
  width: "150px", // 아이콘의 너비
  height: "110px", // 아이콘의 높이
};

const MiroStyle = { // 정답제출 판
  position: 'absolute',
  top: '40%',
  left: '60%',
  margin: '-150px 0 0 -150px'
};




const GameComp_1_11 = () => {
  return (
    <div style={compStyle}>
        <div style={backgroundDiv1}>
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
        <div style={backgroundDiv1}>
          <div style={BoardStyle}>
            <AlphaBoard />
          </div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
          <img src="/stage1SubBtn.png" alt="stage1SubBtn" style={subBtnSttyle} />
        </div>
      </div>
    );
  };
  
  const GameComp_1_13 = () => {
    return (
      <div style={compStyle}>
        <div style={backgroundDiv1}>
          <div style={BoardStyle2}>
            <AlphaBoard />
          </div>
          <div style={MathBoardStyle}>
            <MathBoard/>
          </div>
          <div style={AnsBoardStyle}>
            <AnsBoard/>
          </div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
          <div style={ansSubmitBtn}>정답제출</div>
          <div style={resetBtn}>리셋</div>
          <img src="/equal.png" alt="equal" style={equal} />
          <div style={rectangleStyle}>36</div>
        </div>
      </div>
    );
  };

  const GameComp_2_11 = () => {
    return (
      <div style={compStyle}>
        <div style={backgroundDiv2}>
          <div style={lionview}>사자가 보는 화면 일러스트</div>
          <div style={dist}>열쇠까지의 거리는 3칸입니다.</div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
          <img src="/liondir.png" alt="liondir" style={liondir} />
        </div>
      </div>
    );
  };

  const GameComp_2_12 = () => {
    return (
      <div style={compStyle}>
        <div style={backgroundDiv2}>
          <div style={MiroStyle}>
            <MiroRed/>
          </div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
        </div>
      </div>
    );
  };

  const GameComp_2_13 = () => {
    return (
      <div style={compStyle}>
        <div style={backgroundDiv2}>
          <div style={MiroStyle}>
            <MiroGreen/>
          </div>
          <img src="/questionMark.png" alt="questionMark" style={iconStyle} />
        </div>
      </div>
    );
  };

  export { GameComp_1_11, GameComp_1_12, GameComp_1_13, GameComp_2_11, GameComp_2_12 };
  

