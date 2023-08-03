import React from "react";
import {
  NumberBoard,
  AlphaBoard,
  MathBoard,
  AnsBoard,
  MiroRed,
  MiroGreen,
} from "./Board";
import style from "./GameComps.module.css";
import {
  IntrodialogueData,
  dialogueData,
  OutrodialogueData,
} from "../../../scripts/Scripts";

// const isStage = props.isStage;
// const isIndex = props.isIndex;

const characterToClassMap = {
  도로시: "character_dorothy",
  허수아비: "character_scarecrow",
  사자: "character_lion",
  "양철 나무꾼": "character_tinman",
};

const GameComp = (props) => {
  const isStage = props.isStage;
  const isIndex = props.isIndex;
  console.log(props.isIndex);
  console.log(props.isStage);

  if (isStage === 1 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.backgroundDiv1}>
          <div className={style.BoardStyle}>
            <NumberBoard />
          </div>
          <img
            src="/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.backgroundDiv1}>
          <div className={style.BoardStyle}>
            <AlphaBoard />
          </div>
          <img
            src="/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <img
            src="/stage1SubBtn.png"
            alt="stage1SubBtn"
            className={style.subBtnStyle} // 오타 수정
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.backgroundDiv1}>
          <div className={style.BoardStyle2}>
            <AlphaBoard />
          </div>
          <div className={style.MathBoardStyle}>
            <MathBoard />
          </div>
          <div className={style.AnsBoardStyle}>
            <AnsBoard />
          </div>
          <img
            src="/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <div className={style.ansSubmitBtn}>정답제출</div>
          <div className={style.resetBtn}>리셋</div>
          <img src="/equal.png" alt="equal" className={style.equal} />
          <div className={style.rectangleStyle}>36</div>
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.backgroundDiv2}>
          <div className={style.lionview}>사자가 보는 화면 일러스트</div>
          <div className={style.dist}>열쇠까지의 거리는 3칸입니다.</div>
          <img
            src="/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <img src="/liondir.png" alt="liondir" className={style.liondir} />
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.backgroundDiv2}>
          <div className={style.MiroStyle}>
            <MiroRed />
          </div>
          <img
            src="/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.backgroundDiv2}>
          <div className={style.MiroStyle}>
            <MiroGreen />
          </div>
          <img
            src="/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
    // 스토리 일러스트, 스크립트
  } else if (isStage === 0 && isIndex <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_1}>
          <div className={style.IntrodialogueData}>
            {IntrodialogueData[isIndex].character}
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 0 && isIndex <= 14) {
    const characterName = IntrodialogueData[isIndex].character;
    const characterImageClass = characterToClassMap[characterName];
    return (
      <div className={style.compStyle}>
        <div className={style["background_1"]}>
          <div className={style[characterImageClass]}></div>

          <div className={style.IntrodialogueData}>
            {IntrodialogueData[isIndex].character}
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 0 && isIndex <= 16) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_2"]}>
          <div className={style.IntrodialogueData}>
            {IntrodialogueData[isIndex].character}
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_3"]}>
          <div className={style.dialogueData}>
            {dialogueData[isIndex].character}
            <br />
            {dialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex === 10) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_3"]}></div>
      </div>
    );
  } else if (isStage === 2 && isIndex <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_4"]}>
          <div className={style.dialogueData}>
            {dialogueData[isIndex].character}
            <br />
            {dialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  }
  if (isStage === 2 && isIndex === 11) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_4"]}>
          <div className={style.dialogueData}>
            {dialogueData[isIndex].character}
            <br />
            {dialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 3 && isIndex <= 2) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_5"]}>
          <div className={style.dialogueData}>
            {dialogueData[isIndex].character}
            <br />
            {dialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 3 && isIndex === 10) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_5"]}>
          <div className={style.dialogueData}>
            {dialogueData[isIndex].character}
            <br />
            {dialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  }
  if (isStage === 4 && isIndex <= 1) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_6"]}>
          <div className={style.dialogueData}>
            {dialogueData[isIndex].character}
            <br />
            {dialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex <= 9) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_7"]}>
          <div className={style.OutrodialogueData}>
            {OutrodialogueData[isIndex].character}
            <br />
            {OutrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex <= 13) {
    return (
      <div className={style.compStyle}>
        <div className={style["background_8"]}>
          <div className={style.OutrodialogueData}>
            {OutrodialogueData[isIndex].character}
            <br />
            {OutrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  }
};

export { GameComp };
