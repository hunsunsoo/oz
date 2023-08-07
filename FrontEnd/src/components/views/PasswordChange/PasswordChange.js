import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./Password.module.css";
import InputCode from "./InputCode";
import { useState } from "react";
import InputPassword from "./InputPassword";

const PasswordChange = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isauthSuccess, setIsAuthSuccess] = useState(false);

  return (
    <div>
      {/* 비밀번호 변경 만약에 isauthSuccess true일 경우 변경페이지 false일 경우 인가코드 체크, 이메일 체크 화면 */}
      <div className={style.changepage}>
        <button onClick={() => navigate(`/mypage`)}>뒤로가기</button>
        <div className={style.standard}>
          {isauthSuccess ? (
            <InputPassword />
          ) : (
            <InputCode setIsAuthSuccess={setIsAuthSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
