import React from "react";
import style from "./GameModal.module.css";
import {
  Stage1Explain,
  Stage2Explain,
  Stage3Explain,
  Stage4Explain,
} from "../../../../scripts/gameexplain";
import { useState } from "react";
const stageImages = {
  1: ["/image/explain/hesou(ex).png", "/image/explain/assist(stage1).png"],
  2: [
    "/image/explain/assist(stage2).png",
    "/image/explain/lion(ex).png",
    "/image/explain/assist(stage2).png",
  ],
  3: ["/image/explain/iron(ex).png", "/image/explain/assist(stage3).png"],
  4: ["/image/explain/dorothyhalf.png", "/image/explain/assist(stage4).png"],
};
const GameDescriptionModal = ({ isStage, closeModal }) => {
  const getDescription = () => {
    switch (isStage) {
      case 1:
        return Stage1Explain;
      case 2:
        return Stage2Explain;
      case 3:
        return Stage3Explain;
      case 4:
        return Stage4Explain;
      default:
        return [];
    }
  };

  const descriptionArray = getDescription(isStage);
  const [currentDescIndex, setCurrentDescIndex] = useState(0);

  return (
    <div className="modal">
      <div className={style.modalBox}>
        <div className={style.firstDiv}>
          <div className={style.labelDiv}>
            <div className={style.title}>
              {descriptionArray[currentDescIndex].title}
            </div>
          </div>

          <div className={style.explaincontents}>
            <div className={style.characterDiv}>
              <div className={style.characterframe}>
                <img
                  src={stageImages[isStage][currentDescIndex]}
                  alt="Character Image"
                  className={style.characters}
                />
              </div>
              <strong>{descriptionArray[currentDescIndex].character}</strong>
            </div>
            <div className={style.messageDiv}>
              <p className={style.explain}>
                {descriptionArray[currentDescIndex].message}
              </p>
            </div>
          </div>
        </div>

        <button className={style.closeButton} onClick={closeModal}>
          x
        </button>
        <div className={style.button}>
          <button
            className={style.nextbutton}
            onClick={() => {
              setCurrentDescIndex((prevIndex) => Math.max(0, prevIndex - 1));
            }}
          >
            ◀
          </button>
          <span className={style.index}>
            {currentDescIndex + 1}/{descriptionArray.length}
          </span>
          <button
            className={style.nextbutton}
            onClick={() => {
              setCurrentDescIndex((prevIndex) =>
                Math.min(descriptionArray.length - 1, prevIndex + 1)
              );
            }}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

const GameModal = ({ isStage, closeModal }) => {
  return <GameDescriptionModal isStage={isStage} closeModal={closeModal} />;
};

export default GameModal;
