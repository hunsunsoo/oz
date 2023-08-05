import React, { useState } from "react";
import {
  NumberBoard,
  AlphaBoard,
  MathBoard,
  AnsBoard,
  MiroRed,
  MiroGreen,
} from "./Board";
import App from "./test";
import style from "./GameComps.module.css";
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  IntrodialogueData,
  dialogue1Data,
  dialogue2Data,
  dialogue3Data,
  dialogue4Data,
  OutrodialogueData,
} from "../../../scripts/Scripts";

const characterToClassMap = {
  도로시: "character_dorothy",
  허수아비: "character_scarecrow",
  사자: "character_lion",
  "양철 나무꾼": "character_tinman",
};
const getCharacterClass = (data, index) => {
  const characterName = data[index].character;
  return characterToClassMap[characterName];
};

const Image = ({ src, alt }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: { src, alt },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <img
      ref={drag}
      src={src}
      alt={alt}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  );
};

const GameComp = (props) => {
  // const isStage = props.isStage;
  // const isIndex = props.isIndex;

  const isStage = props.isStage;
  const isIndex = props.isIndex;

  // selectedCells와 setSelectedCells를 useState로 정의합니다.
  const [selectedCells, setSelectedCells] = useState([]);

  // 클릭 이벤트 처리 함수
  const handleCellClick = (cellValue) => {
    // 이미 선택된 칸인지 확인
    const isCellSelected = selectedCells.includes(cellValue);

    if (isCellSelected) {
      // 이미 선택된 칸이라면 해당 값을 배열에서 제거
      setSelectedCells(selectedCells.filter((value) => value !== cellValue));
    } else {
      // 새로 선택된 칸이라면 해당 값을 배열에 추가
      setSelectedCells([...selectedCells, cellValue]);
    }
  };

  // 게임 part
  // 1스테이지
  if (isStage === 1 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.BoardStyle}>
            <NumberBoard />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 12) {
    const handleCellClick = (cellValue) => {
      // 클릭 이벤트 처리 함수
      // 클릭한 칸의 값을 상태에 추가 또는 제거
      setSelectedCells((prevSelectedCells) =>
        prevSelectedCells.includes(cellValue)
          ? prevSelectedCells.filter((value) => value !== cellValue)
          : [...prevSelectedCells, cellValue]
      );
    };
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.BoardStyle}>
            <AlphaBoard onCellClick={handleCellClick} />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <img
            src="image/tools/stage1SubBtn.png"
            alt="stage1SubBtn"
            className={style.selectBtn}
            onClick={props.changeIsIndex}
          />
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
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
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <div className={style.ansSubmitBtn} onClick={props.changeIsClear}>정답제출</div>
          <div className={style.resetBtn}>리셋</div>
          <img
            src="image/tools/equal.png"
            alt="equal"
            className={style.equal}
          />
          <div className={style.rectangleStyle}>36</div>
        </div>
      </div>
    );
    // 2스테이지
  } else if (isStage === 2 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.lionview}>사자가 보는 화면 일러스트</div>
          <div className={style.dist}>열쇠까지의 거리는 3칸입니다.</div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
          <img
            src="image/tools/liondir.png"
            alt="liondir"
            className={style.liondir}
          />
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroRed />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex == 13) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.MiroStyle}>
            <MiroGreen />
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
    // 3스테이지
  } else if (isStage === 3 && isIndex == 11) {
    return (
      <div className={style.compStyle}>
        <div className={style.container}>
          <div className={style.puzzleLeft}>
            <img src="/image/game/puzzleGame/puzzleGameBgHeart.JPG" alt="" className={style.puzzleImage} />
          </div>
          <DndProvider backend={HTML5Backend}>
            <div className={style.puzzleRight}>
              {Array.from({ length: 6 }, (_, row) =>
                Array.from({ length: 6 }, (_, col) => (
                  <div key={row * 6 + col} className={style.gridImage}>
                    <Image
                      src={`/image/game/puzzleGame/puzzlePiece/${(row + 1) * 10 + (col + 1)}.png`} // 이미지 파일의 경로를 동적으로 생성
                      alt={`Image ${row * 6 + col + 1}`}
                    />
                  </div>
                ))
              )}
            </div>
          </DndProvider>
        </div>
        <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        <div className={style.stage3SelectBtn} onClick={props.changeIsClear}>선택완료</div>
      </div>
    );
    // 4스테이지
  } else if (isStage === 4 && isIndex == 11) {
    return(
      <div className={style.compStyle}>
        <div className={style.backgroundDiv4}>
          <div className={style.drawing}>
            <App></App>
          </div>
          <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
        </div>
      </div>
    );
  } else if (isStage === 4 && isIndex == 12) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <div className={style.word}>제시어</div>
          <div className={style.drawingDiv}> 그림판 </div>
        </div>
        <img
            src="image/tools/questionMark.png"
            alt="questionMark"
            className={style.iconStyle}
          />
      </div>
    );
    // 인트로 스토리
  } else if (isStage === 0 && isIndex <= 2) { 
    return (
      <div className={style.compStyle}>
        <div className={style.background_S1}>
          <div className={style.illustration}>
            {IntrodialogueData[isIndex].character}
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  } else if (isStage === 0 && isIndex <= 13) {
    const characterImageClass = getCharacterClass(IntrodialogueData, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_S2}>
          <div className={style.script}>
            {IntrodialogueData[isIndex].character}
            <br />
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 0 && isIndex <= 16) {
    return (
      <div className={style.compStyle}>
        <div className={style.background_S3}>
          <div className={style.illustration}>
            {IntrodialogueData[isIndex].character}
            <br />
            <br />
            {IntrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
    // 1스테이지 스토리
  } else if (isStage === 1 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue1Data, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.script}>
            {dialogue1Data[isIndex].character}
            <br />
            <br />
            {dialogue1Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex == 3) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
        </div>
      </div>
    );
  } else if (isStage === 1 && isIndex === 21) { // 클리어 후
    const characterImageClass = getCharacterClass(dialogue1Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle}>
        <div className={style.background_G1}>
          <div className={style.script}>
            {dialogue1Data[3].character}
            <br />
            <br />
            {dialogue1Data[3].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
    // 2스테이지 스토리
  } else if (isStage === 2 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue2Data, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <div className={style.script}>
            {dialogue2Data[isIndex].character}
            <br />
            <br />
            {dialogue2Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 2 && isIndex === 3) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G2}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
        </div>
      </div>
    );
    // 3스테이지 스토리
  } else if (isStage === 3 && isIndex <= 2) {
    const characterImageClass = getCharacterClass(dialogue3Data, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_G3}>
          <div className={style.script}>
            {dialogue3Data[isIndex].character}
            <br />
            <br />
            {dialogue3Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 3 && isIndex === 3) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G3}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
        </div>
      </div>
    );
  } else if (isStage === 3 && isIndex === 21) { // 클리어 후
    const characterImageClass = getCharacterClass(dialogue3Data, 3);
    console.log(characterImageClass);
    return (
      <div className={style.compStyle}>
        <div className={style.background_G3}>
          <div className={style.script}>
            {dialogue3Data[3].character}
            <br />
            <br />
            {dialogue3Data[3].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
    // 4스테이지 스토리
  } else if (isStage === 4 && isIndex <= 1) {
    const characterImageClass = getCharacterClass(dialogue3Data, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <div className={style.script}>
            {dialogue4Data[isIndex].character}
            <br />
            <br />
            {dialogue4Data[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 4 && isIndex === 2) { // ready 화면 + 방법설명
    return (
      <div className={style.compStyle}>
        <div className={style.background_G4}>
          <img 
            src="image/character/troop2.png"
            alt=""
            className={style.troop2}
          />
          <div className={style.howToPlayImg}>
            게임 방법 넣을 part
          </div>
          <div className={style.readyBtn} onClick={props.changeIsReady}>
            준비 완료
          </div>
          <div className={style.howToPlayBtn}>
            게임 방법
          </div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex <= 9) {
    const characterImageClass = getCharacterClass(OutrodialogueData, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_S5}>
          <div className={style.script}>
            {OutrodialogueData[isIndex].character}
            <br />
            <br />
            {OutrodialogueData[isIndex].message}
          </div>
          <div className={style[characterImageClass]}></div>
        </div>
      </div>
    );
  } else if (isStage === 5 && isIndex <= 13) {
    const characterImageClass = getCharacterClass(OutrodialogueData, isIndex);
    return (
      <div className={style.compStyle}>
        <div className={style.background_S6}>
          <div className={style[characterImageClass]}></div>
          <div className={style.illustration}>
            {OutrodialogueData[isIndex].character}
            <br />
            <br />
            {OutrodialogueData[isIndex].message}
          </div>
        </div>
      </div>
    );
  }
};

export { GameComp };
