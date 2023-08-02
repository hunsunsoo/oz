import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header.js"
import RoleSelect from '../../RoleSelect.js';
import FriendsRTC from '../Footer/FriendsRTC';

const SelectRolePage = () => {
  const navigate = useNavigate();

  // const handleButtonClick = () => {
  //   // "/about" 페이지로 이동
  //   navigate('/about');
  // };

  const divStyle = {
    margin: '0',
    padding: '0',
    height: '100vh',
    overflow: 'hidden' /* 스크롤 막기 */
  };

  return (
    <div style={divStyle}>
      <Header />
      <RoleSelect />
      <FriendsRTC/>
    </div>
  );
};
  
  export default SelectRolePage;