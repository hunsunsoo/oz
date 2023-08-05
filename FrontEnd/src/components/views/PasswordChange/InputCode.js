import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../../_actions/axiosInstance";
import style from "./InputCode.module.css";

// 스타일이 필요한 경우 여기에 임포트하세요

const InputCode = ({ setIsAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onCodeHandler = (e) => {
    setCode(e.currentTarget.value);
  };

  const onSubmitEmailHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(accessToken);
      const response = await axiosInstance.get("/users/mail", {
        headers: {
          AccessToken: accessToken,
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        alert(response.data);
      }
    } catch (error) {
      alert("올바르지 않은 이메일입니다");
    }
  };
  const onSubmitCodeHandler = async (e) => {
    e.preventDefault();
    let body = {
      emailCode: code,
    };
    console.log(accessToken);
    console.log(body);
    try {
      const response = await axiosInstance.post("users/codechek", {
        emailCode: code,
      });

      if (response.status === 200) {
        alert(response.data);
        setIsAuthSuccess(true);
      }
    } catch (error) {
      console.log(error);
      alert(error.msg);
    }
  };

  return (
    <div>
      <div className={style.box}>
        <form onSubmit={onSubmitEmailHandler}>
          <input type="email" value={email} onChange={onEmailHandler}></input>
          <button>이메일제출</button>
        </form>
        <form onSubmit={onSubmitCodeHandler}>
          <input type="text" value={code} onChange={onCodeHandler}></input>
          <button>인증번호제출</button>
        </form>
      </div>
    </div>
  );
};

export default InputCode;
