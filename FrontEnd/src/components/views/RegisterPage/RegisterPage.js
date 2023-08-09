import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser, emailAvailable } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import style from "./RegisterPage.module.css";
function RegisterPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [NickName, setNickName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  // usestate: const [state, setstate] = useState(initialState) 자동완성.
  // initialState : = placeholder

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onSubmitEmailHandler = async (e) => {
    e.preventDefault();
    await dispatch(emailAvailable(Email).then((response) => {
      if(response.payload.status === 200){
        alert(response.payload.data);
      }else alert(response.payload.error);
    }));
  };

  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onNickNameHandler = (event) => {
    setNickName(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onConfirmPassword = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호 확인은 같아야합니다.");
    } else if (Name.length === 0) {
      return alert("이름을 입력하세요");
    } else if (NickName.length === 0) {
      return alert("닉네임을 입력하세요");
    } else if (Email.length === 0) {
      return alert("이메일 입력하세요");
    } else if (Password.length === 0) {
      return alert("비밀번호를 입력하세요");
    }

    console.log("Email", Email);
    console.log("Password", Password);

    let body = {
      name: Name,
      nickname: NickName,
      email: Email,
      password: Password,
    };

    dispatch(registerUser(body)).then((response) => {
      console.log(response);
      // console.log(response.payload.success);
      // console.log(response);
      if (response.payload === "회원 가입 완료") {
        navigate("/login");

        // 성공하면  root page(landing page)로 가라
      } else {
        console.log(response);
      }
    });

    // Axios.post("/api/users/signup", body).then((response) => {
    //   console.log(response);
    // });
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
          <div className={style.logo}>
            <img className={style.logoImage} 
            src= {process.env.PUBLIC_URL + "/image/logo/real_logo.png"}
            onClick={() => navigate(`/`)}></img>
          </div>
          <div className={style.allBox}>

            <div className={style.topBox}>
              <div className={style.frontZone}>
              </div>
              <input className={style.inputZone}
              type="text"
              value={Name}
              placeholder="Name"
              onChange={onNameHandler}>
              </input>
            </div>

            <div className={style.bottomBox}>
              <div className={style.frontZone}>
              </div>
              <input className={style.inputZone}
              type="text"
              value={NickName}
              placeholder="NickName"
              onChange={onNickNameHandler}>
              </input>
            </div>

            <div className={style.bottomBox}>
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
                onClick={onSubmitEmailHandler}>인증</button>
              </div>
            </div>

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

            <div className={style.registDiv}>
              <button className={style.registButton}
                onClick={onSubmitHandler}>회원 등록하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
