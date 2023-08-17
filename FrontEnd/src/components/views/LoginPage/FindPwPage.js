import React, { useState } from "react";
import axiosInstance from "../../../_actions/axiosInstance";
import { useNavigate } from "react-router-dom";
import style from "./FindPwPage.module.css";
function RegisterPage(props) {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Code, setEmailCode] = useState("");
  const [State, setState] = useState(false);
  const [IsAuthSuccess, setIsAuthSuccess] = useState(false);

  // usestate: const [state, setstate] = useState(initialState) 자동완성.
  // initialState : = placeholder

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onSubmitEmailHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(Email);
      const response = await axiosInstance.post("/users/mail", {
        email: Email,
      });
      console.log(response.data);
      if (response.status === 200) {
        alert(response.data);
        setState(true);
      }
    } catch (error) {
      alert("올바르지 않은 이메일입니다");
    }
  };

  const onEmailCodeHandler = (event) => {
    setEmailCode(event.currentTarget.value);
  };

  const onSubmitCodeHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("users/codechek", {
        emailCode: Code,
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

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onConfirmPassword = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();

    if(!State){
        return alert("이메일 인증 코드를 입력해 주세요");
    }else if (!IsAuthSuccess){
        return alert("이메일 인증이 필요합니다");
    }else if (Password.length === 0) {
        return alert("비밀번호를 입력하세요");
    }else if (Password !== ConfirmPassword) {
        return alert("비밀번호가 다릅니다");
    }

    axiosInstance
      .put("/users/update/password", {
        email: Email,
        newPassword: Password,
      })
      .then((response) => {
        alert("비밀번호가 변경되었습니다");
        navigate('/login');
      })
      .catch((error) => {
        alert("비밀번호 변경을 실패했습니다");
      });
  };

  return (
    <div className={style.registerPage}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className={style.box}>
        <button className={style.closeInputBox}
                onClick={() => navigate(`/login`)}
                >
                  <i class="fi fi-rr-left"></i>
            </button>
          <div className={style.logo}>
            <img className={style.logoImage} 
            src= {process.env.PUBLIC_URL + "/image/logo/real_logo.png"}
            onClick={() => navigate(`/`)}></img>
          </div>
          <div className={style.allBox}>

            <div className={style.topBox}>
            <div className={style.frontZone}>
              </div>
              <input className={style.emailZone}
              type="email"
              value={Email}
              placeholder="Email"
              onChange={onEmailHandler}>
              </input>
              <div className={style.emailButtonZone}>
                <button className={style.emailButton}
                onClick={onSubmitEmailHandler}>전송</button>
              </div>
            </div>

            {State && (
              <div className={style.codeBox}>
              <div className={style.frontZone}>
              </div>
              <input className={style.codeZone}
              type="text"
              value={Code}
              placeholder="Code"
              onChange={onEmailCodeHandler}>
              </input>
              <div className={style.codeButtonZone}>
                <button className={style.emailButton}
                onClick={onSubmitCodeHandler}>인증</button>
              </div>
            </div>
            )}

            {IsAuthSuccess && (
                <div className={style.bottomBox}>
                <div className={style.frontZone}>
                </div>
                <input className={style.inputZone}
                type="password"
                value={Password}
                placeholder="Password"
                onChange={onPasswordHandler}>
                </input>
                </div>
            )}

            {IsAuthSuccess && (
                <div className={style.bottomBox}>
                <div className={style.frontZone}>
                </div>
                <input className={style.inputZone}
                type="password"
                value={ConfirmPassword}
                onChange={onConfirmPassword}
                placeholder="ConfirmPassword">
                </input>
                </div>
            )}

            <div className={style.registDiv}>
              <button className={style.registButton}
                onClick={onSubmitHandler}>비밀번호 변경하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
