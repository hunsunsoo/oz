import React, { useState } from "react";
import { IntrodialogueData } from "../../scripts/Scripts";
import Header from "../Header/Header.js";
import RoleSelect from "../../RoleSelect.js";
import FriendsRTC from "../Footer/FriendsRTC";
import { GameComp } from "./GamePlay";

const GamePlayPage = () => {
  const [isState, setIsState] = useState(0);
  const [isIndex, setIsIndex] = useState(0);
  const stageLimits = [16, 11, 12, 11, 7, 14];
  const handleNext = () => {
    if (isIndex < stageLimits[isState]) {
      setIsIndex(isIndex + 1);
    } else {
      setIsIndex(0);
      setIsState(isState + 1);
    }
  };
  const renderComponent = (isState, isIndex) => {
    const types = ["intro", "stage1", "stage2", "stage3", "stage4", "outro"];
    return <GameComp type={types[isState]} index={isIndex} />;
  };

  // const renderComponent = (isState, isIndex) => {
  //   switch (isState) {
  //     case 0:
  //       console.log(1);
  //       return <GameComp type="intro" index={isIndex} />;
  //     case 1:
  //       console.log(2);
  //       console.log(isIndex);
  //       return <GameComp type="stage1" index={isIndex} />;
  //     case 2:
  //       return <GameComp type="stage2" index={isIndex} />;
  //     case 3:
  //       return <GameComp type="stage3" index={isIndex} />;
  //     case 4:
  //       return <GameComp type="stage4" index={isIndex} />;
  //     case 5:
  //       return <GameComp type="outro" index={isIndex} />;
  //     default:
  //       return null;
  //   }
  // };

  const divStyle = {
    margin: "0",
    padding: "0",
    height: "100vh",
    overflow: "hidden",
  };

  const bodyStyle = {
    width: "100%",
    height: "60%",
    backgroundColor: "#DDE5B6",
  };

  return (
    <div style={divStyle}>
      <Header />
      <div style={bodyStyle}>{renderComponent(isState, isIndex)}</div>
      <button onClick={handleNext}>Next</button>
      {isIndex}
    </div>
  );
};

export default GamePlayPage;

// const GamePlayPage = () => {
//   const [isState, setIsState] = useState(0);
//   const [isIndex, setIsIndex] = useState(1);

//   const handleNext = () => {
//     if (isIndex < 15) {
//       setIsIndex(isIndex + 1);
//     } else if (isState == 15) {
//       setIsState(isState + 1);
//     }
//   };

//   let componentToRender;

//   const renderComponent = (isState, isIndex) => {
//     switch (isState) {
//       case 0: // 이게 스테이지 구분 (0-1)
//         switch (
//           isIndex // 이게 인덱스 구분
//         ) {
//           case 1:
//             return <GameComp_0_1 />;
//             break;
//           case 2:
//             return <GameComp_0_2 />;
//             break;
//           case 3:
//             return <GameComp_0_3 />;
//             break;
//         }
//       case 1: // 이게 스테이지 구분 (1-1)
//         switch (
//           isIndex // 이게 인덱스 구분
//         ) {
//           case 1:
//             componentToRender = null;
//             break;
//           case 2:
//             componentToRender = null;
//             break;
//           case 3:
//             componentToRender = <GameComp_1_12 />;
//             break;
//         }
//       case 2: // 이게 스테이지 구분 (2-1)
//         switch (
//           isIndex // 이게 인덱스 구분
//         ) {
//           case 1:
//             componentToRender = null;
//             break;
//           case 2:
//             componentToRender = <GameComp_1_12 />;
//             break;
//           case 3:
//             componentToRender = <GameComp_1_12 />;
//             break;
//         }
//     }
//   };

//   const divStyle = {
//     // header, rtc 포함된 전체 div
//     margin: "0",
//     padding: "0",
//     height: "100vh",
//     overflow: "hidden" /* 스크롤 막기 */,
//   };

//   const bodyStyle = {
//     // body 부분 (배경색상용)
//     width: "100%",
//     height: "60%",
//     backgroundColor: "#DDE5B6",
//   };

//   return (
//     <div style={divStyle}>
//       <Header />
//       <div style={bodyStyle}>{renderComponent(isState, isIndex)}</div>
//       <button onClick={handleNext}>Next</button> {/* 다음 버튼 */}
//       {/* <FriendsRTC /> */}
//       {isIndex}
//     </div>
//   );
// };
