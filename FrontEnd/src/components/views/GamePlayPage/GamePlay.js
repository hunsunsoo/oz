import React, { Component } from "react";
import NumberBoard from "./NumberBoard";
import AlphaBoard from "./AlphaBoard";
import style from "./GamePlay.module.css";
import {
  IntrodialogueData,
  dialogueData,
  OutrodialogueData,
} from "../../scripts/Scripts";
const characterToClassMap = {
  도로시: "character_dorothy",
  허수아비: "character_scarecrow",
  사자: "character_lion",
  "양철 나무꾼": "character_tinman",
  // 다른 캐릭터들...
};

const GameComp = React.memo(({ type, index }) => {
  // const dialogueDataMapping = {
  //   intro: IntrodialogueData,
  //   outro: OutrodialogueData,
  // };

  // const data = dialogueDataMapping[type][index];

  // 다른 type에 따른 컴포넌트 렌더링
  if (type === "intro" && index <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_1}>
          <div className={style.IntrodialogueData}>
            {IntrodialogueData[index].character}
            <br />
            {IntrodialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "intro" && index <= 14) {
    const characterName = IntrodialogueData[index].character;
    const characterImageClass = characterToClassMap[characterName];
    return (
      <div className={style.compStyle}>
        <div className={style["background_1"]}>
          <div className={style[characterImageClass]}></div>

          <div className={style.IntrodialogueData}>
            {IntrodialogueData[index].character}
            <br />
            {IntrodialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "intro" && index <= 16) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_2"]}>
          <div className={style.IntrodialogueData}>
            {IntrodialogueData[index].character}
            <br />
            {IntrodialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "stage1" && index <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_3"]}>
          <div className={style.dialogueData}>
            {dialogueData[index].character}
            <br />
            {dialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "stage1" && index === 10) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_3"]}></div>
      </div>
    );
  }
  if (type === "stage2" && index <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_4"]}>
          <div className={style.dialogueData}>
            {dialogueData[index].character}
            <br />
            {dialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "stage2" && index === 11) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_4"]}>
          <div className={style.dialogueData}>
            {dialogueData[index].character}
            <br />
            {dialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "stage3" && index <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_5"]}>
          <div className={style.dialogueData}>
            {dialogueData[index].character}
            <br />
            {dialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "stage3" && index === 10) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_5"]}>
          <div className={style.dialogueData}>
            {dialogueData[index].character}
            <br />
            {dialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "stage4" && index <= 1) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_6"]}>
          <div className={style.dialogueData}>
            {dialogueData[index].character}
            <br />
            {dialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "outro" && index <= 9) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_7"]}>
          <div className={style.OutrodialogueData}>
            {OutrodialogueData[index].character}
            <br />
            {OutrodialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }
  if (type === "outro" && index <= 13) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_8"]}>
          <div className={style.OutrodialogueData}>
            {OutrodialogueData[index].character}
            <br />
            {OutrodialogueData[index].message}
          </div>
        </div>
      </div>
    );
  }

  // 다른 type의 예
  if (type === "otherType") {
    // 여기에 다른 타입의 컴포넌트 렌더링 로직
  }
});

export { GameComp };
