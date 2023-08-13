import React, { useState, useEffect } from "react";
import GameModal from "../GameModal/GameModal";
import { useSelector } from "react-redux";

const PuzzleReady = ({ onHandleStart }) => {
  const stageval = 4;
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const preventNavigation = (event) => {
      event.preventDefault();
      event.returnValue = false;
      return false;
    };

    // 이벤트 리스너를 추가합니다.
    window.addEventListener("beforeunload", preventNavigation);
    window.addEventListener("popstate", preventNavigation);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener("beforeunload", preventNavigation);
      window.removeEventListener("popstate", preventNavigation);
    };
  }, []);

  const onHandleExplain = () => {
    setShowModal(true);
  };

  return (
    <div>
      {showModal && (
        <GameModal isStage={stageval} closeModal={() => setShowModal(false)} />
      )}
      <button onClick={onHandleStart}>게임 시작</button>
      <button onClick={onHandleExplain}>게임 설명</button>
    </div>
  );
};

export default PuzzleReady;
