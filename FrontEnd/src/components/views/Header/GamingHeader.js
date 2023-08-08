import React from 'react';
import Clock from "./Clock.js"

const headerStyle = {
  backgroundColor: '#CABE96',
  color: 'white',
  height: '10%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // 네비바 내에서 좌우 정렬
  padding: '0 20px', // 좌우 여백 추가
};
  
const logoStyle = {
  width: '80px', // 로고 이미지 너비 설정
  height: 'auto', // 로고 이미지 높이는 자동으로 조정
};
  
const profilePicStyle = {
  width: 'auto',
  height: '99%',
  borderRadius: '50%',
  objectFit: 'cover',
}


const GamingHeader = () => {
  return (
    <header style={headerStyle}>
      <div>
        <img src="image/logo/logo.png" alt="Logo" style={logoStyle} />
      </div>
      <div>
        <Clock />
      </div>
      <div style={{height:"100%"}}>
        <img src="image/tools/profile_default_test.png" alt="Profile" style={profilePicStyle} />
      </div>
    </header>
  );
}

export default GamingHeader;

