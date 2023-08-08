import React, { useState, useEffect } from "react";
import "./App.css";

const CHARACTER1_IMAGE_PATH = "character1.png";
const CHARACTER2_IMAGE_PATH = "character2.png";
const SCRIPT_FILE_PATH = "script.txt";

const App = () => {
  const [scriptLines, setScriptLines] = useState([]); // 스크립트 대화 내용을 저장하는 상태
  const [currentCharacterImage, setCurrentCharacterImage] = useState(
    CHARACTER1_IMAGE_PATH
  ); // 현재 표시 중인 캐릭터 이미지 경로
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0); // 현재 대화 내용 인덱스

  useEffect(() => {
    fetchScript(); // 컴포넌트가 마운트되면 스크립트 파일을 불러오는 함수 실행
  }, []);

  // 스크립트 파일을 불러와 scriptLines 상태에 저장하는 함수
  const fetchScript = async () => {
    try {
      const response = await fetch(SCRIPT_FILE_PATH);
      const data = await response.text();
      setScriptLines(data.split("\n").map((line) => line.trim()));
    } catch (error) {
      console.error("Error fetching script:", error);
    }
  };

  // 캐릭터 이미지를 번갈아가며 전환하는 함수
  const toggleCharacterImage = () => {
    setCurrentCharacterImage((prevImage) =>
      prevImage === CHARACTER1_IMAGE_PATH
        ? CHARACTER2_IMAGE_PATH
        : CHARACTER1_IMAGE_PATH
    );
  };

  // "Next" 버튼 클릭 시 다음 대화 내용으로 전환하는 함수
  const handleNext = () => {
    if (currentCharacterIndex < scriptLines.length - 1) {
      toggleCharacterImage(); // 캐릭터 이미지 전환
      setCurrentCharacterIndex((prevIndex) => prevIndex + 1); // 다음 대화 내용 인덱스로 업데이트
    }
  };

  return (
    <div className="App">
      <div className="character-container">
        <img
          src={currentCharacterImage}
          alt="Character"
          className="character-image"
        />
      </div>
      <div className="dialogue-container">
        <p className="dialogue-text">{scriptLines[currentCharacterIndex]}</p>
        {currentCharacterIndex < scriptLines.length - 1 && (
          <button onClick={handleNext} className="next-button">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
