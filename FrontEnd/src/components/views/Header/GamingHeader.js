import React from 'react';
import Clock from "./Clock.js"
import styled from 'styled-components';
import { useSelector } from "react-redux";

const headerStyle = {
  backgroundColor: '#CABE96',
  color: 'white',
  height: '10%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2%', // 좌우 여백 추가
};
  
const profilePicStyle = {
  width: 'auto',
  height: '99%',
  borderRadius: '50%',
  objectFit: 'cover',
}

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  position: relative;
`;

const Image = styled.img`
  width: 20%;
  height: 115px;
  object-fit: cover;
  border-radius: ${props => (props.isHighlighted ? '50%' : '0')};
  border: ${props => (props.isHighlighted ? '2px solid blue' : 'none')};
  margin: 10px;
`;


const GamingHeader = ({myRole}) => {
  const stage = useSelector((state) => state.gameUserReducer.gameUsers); //stage에 body 값 추출
  const stageval = stage && stage.isStage ? stage.isStage : 0; //body 값에 stage 값 추출 

  console.log("stage:", stageval); //콘솔 찍어보기
  return (
    <header style={headerStyle}>
      <div>
      <Container>
          <div>
          {stageval === 0 || stageval === 1 ? (
            <div>
              <img src="image/house/house1sad.png" alt="stage 1" style={{ width: '100px', height: '100px', position: 'absolute' }} />
              <img src="image/house/star2.png" alt="another image" style={{ width: '100px', height: '100px' }} />
            </div>
          ) : (
            <div>
              <img src="image/house/house1happy.png" alt="stage 1" style={{ width: '100px', height: '95px' }} />
            </div>
          )}
          </div>
          {stageval === 2 ? (
            <div>
              <img src="image/house/house2sad.png" alt="stage 2" style={{ width: '100px', height: '100px', position: 'absolute' }} />
              <img src="image/house/star2.png" alt="another image" style={{ width: '100px', height: '100px' }} />
            </div>
          ) : (
              <div>
              <img src="image/house/house2happy.png" alt="stage 2" style={{ width: '105px', height: '95px' }} />
            </div>
          )}
          {stageval === 3 ? (
            <div>
              <img src="image/house/house3sad.png" alt="stage 3" style={{ width: '100px', height: '100px', position: 'absolute' }} />
              <img src="image/house/star2.png" alt="another image" style={{ width: '100px', height: '100px' }} />
            </div>
          ) : (
            <div>
              <img src="image/house/house3happy.png" alt="stage 3" style={{ width: '100px', height: '100px' }} />
            </div>
          )}
          {stageval === 4 ? (
            <div>
              <img src="image/house/house4.png" alt="stage 4" style={{ width: '100px', height: '100px', position: 'absolute' }} />
              <img src="image/house/star2.png" alt="another image" style={{ width: '100px', height: '100px' }} />
            </div>
          ) : (
            <div>
              <img src="image/house/house4.png" alt="stage 4" style={{ width: '105px', height: '105px' }} />
            </div>
          )}
      </Container>
      </div>
      <div>
        <Clock />
      </div>
      <div style={{ height: "100%", marginLeft: "22%" }}>
        {myRole === 1 ? (
          <img src="image/character/dorothy.png" alt="Profile" style={profilePicStyle} />
        ) : myRole === 2 ? (   
          <img src="image/character/liona.png" alt="Profile" style={profilePicStyle} />
        ) : myRole === 3 ? (
          <img src="image/character/heosua.png" alt="Profile" style={profilePicStyle} />
        ) : (
          <img src="image/character/twa.png" alt="Profile" style={profilePicStyle} />
        )}
      </div>
    </header>
  );
}

export default GamingHeader;

