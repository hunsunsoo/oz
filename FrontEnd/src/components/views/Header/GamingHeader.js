import React, { useState, useEffect } from "react";
import Clock from "./Clock.js";
import { useSelector } from "react-redux";

const headerStyle = {
  backgroundColor: "#CABE96",
  color: "white",
  height: "10%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 2%", // 좌우 여백 추가
};

const profilePicStyle = {
  width: "80px",
  height: "75px",
  marginTop: "9px",
  borderRadius: "50%",
  objectFit: "cover",
  backgroundColor: "gray", // 회색 배경색
  overflow: "hidden", // 내부 이미지를 벗어나지 않도록 함
};

const GamingHeader = ({ myRole }) => {
  const stage = useSelector((state) => state.gameUserReducer.gameUsers); //stage에 body 값 추출
  const stageval = stage && stage.isStage ? stage.isStage : 0; //body 값에 stage 값 추출

  const [rotationDegree, setRotationDegree] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationDegree(rotationDegree + 1);
    }, 10); // 10ms 마다 1도씩 회전 각도를 증가

    return () => clearInterval(interval); // 컴포넌트가 언마운트 될 때 인터벌 정리
  }, [rotationDegree]);

  // console.log("stage:", stageval); //콘솔 찍어보기
  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {stageval === 0 || stageval === 1 ? (
            <div>
              <img
                src="image/house/star2.png"
                alt="stage1"
                style={{
                  width: "100px",
                  height: "100px",
                  transform: `rotate(${rotationDegree}deg)`,
                  position: "absolute",
                }}
              />
              <img
                src="image/house/house1sad.png"
                alt="stage1"
                style={{
                  width: "100px",
                  height: "100px",
                  position: "relative",
                }}
              />
            </div>
          ) : (
            <div>
              <img
                src="image/house/house1happy.png"
                alt="stage1"
                style={{ width: "100px", height: "95px", position: "relative" }}
              />
            </div>
          )}
        </div>
        <div>
          {stageval === 2 ? (
            <div>
              <img
                src="image/house/star2.png"
                alt="stage2"
                style={{
                  width: "100px",
                  height: "100px",
                  transform: `rotate(${rotationDegree}deg)`,
                  position: "absolute",
                }}
              />
              <img
                src="image/house/house2sad.png"
                alt="stage2"
                style={{
                  width: "100px",
                  height: "100px",
                  position: "relative",
                }}
              />
            </div>
          ) : (
            <div>
              <img
                src="image/house/house2happy.png"
                alt="stage2"
                style={{ width: "105px", height: "95px", position: "relative" }}
              />
            </div>
          )}
        </div>
        <div>
          {stageval === 3 ? (
            <div>
              <img
                src="image/house/star2.png"
                alt="another image"
                style={{
                  width: "100px",
                  height: "100px",
                  transform: `rotate(${rotationDegree}deg)`,
                  position: "absolute",
                }}
              />
              <img
                src="image/house/house3sad.png"
                alt="stage3"
                style={{
                  width: "100px",
                  height: "100px",
                  position: "relative",
                }}
              />
            </div>
          ) : (
            <div>
              <img
                src="image/house/house3happy.png"
                alt="stage3"
                style={{
                  width: "100px",
                  height: "100px",
                  position: "relative",
                }}
              />
            </div>
          )}
        </div>
        <div>
          {stageval === 4 ? (
            <div>
              <img
                src="image/house/star2.png"
                alt="stage4"
                style={{
                  width: "100px",
                  height: "100px",
                  transform: `rotate(${rotationDegree}deg)`,
                  position: "absolute",
                }}
              />
              <img
                src="image/house/house4.png"
                alt="stage4"
                style={{
                  width: "100px",
                  height: "100px",
                  position: "relative",
                }}
              />
            </div>
          ) : (
            <div>
              <img
                src="image/house/house4.png"
                alt="stage4"
                style={{
                  width: "105px",
                  height: "105px",
                  position: "relative",
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <Clock />
      </div>
      <div style={{ height: "100%" }}>
        {myRole === 1 ? (
          <img
            src="image/character/dorothy.png"
            alt="Profile"
            style={profilePicStyle}
          />
        ) : myRole === 2 ? (
          <img
            src="image/character/liona.png"
            alt="Profile"
            style={profilePicStyle}
          />
        ) : myRole === 3 ? (
          <img
            src="image/character/heosua.png"
            alt="Profile"
            style={profilePicStyle}
          />
        ) : (
          <img
            src="image/character/twa.png"
            alt="Profile"
            style={profilePicStyle}
          />
        )}
      </div>
    </header>
  );
};

export default GamingHeader;
