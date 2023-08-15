import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <img src='image/logo/logo.png' alt="Service Logo" style={logoStyle} />
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#CABE96',
  color: 'white',
  height:'8%',
  display: 'flex',
  alignItems: 'center',
};

const logoStyle = {
  height: '80%', // 로고 이미지가 헤더의 높이와 동일하도록 설정
  marginRight: '10px', // 로고와 헤더 사이의 간격을 조절하려면 필요한 만큼 수정
};


export default Header;
