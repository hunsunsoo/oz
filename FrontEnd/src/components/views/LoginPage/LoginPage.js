import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";
import style from "./LoginPage.module.css";
import { useCookies } from "react-cookie";
import axiosInstance from "../../../_actions/axiosInstance";
import { REST_API_KEY, REDIRECT_URI } from "./KakaoLoginData";
function LoginPage(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1.  로그인 데이터 부분
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  // usestate: const [state, setstate] = useState(initialState) 자동완성.
  // initialState : = placeholder

  // 2. 데이터 부분
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  // cookies
  const [cookies, setCookies] = useCookies();

  const enterKeyPress = (event) => {
    if (event.key === "Enter") {
      onSubmitHandler(event);
    }
  };

  //3. 데이터 리덕스 전달 순서 (body를 디스패치로 던진다. -> actions 에서 처리 -> userreducer에서 저장
  const onSubmitHandler = (event) => {
    event.preventDefault();

    console.log("Email", Email);
    console.log("Password", Password);

    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.data === "로그인 성공") {
        const Atoken = response.payload.headers.accesstoken;
        const Rtoken = response.payload.headers.refreshtoken;
        setCookies("Atoken", Atoken);
        setCookies("Rtoken", Rtoken);
        navigate("/");

        // 성공하면  root page(landing page)로 가라
      } else {
        if (
          response.payload.payload.error === "해당 회원을 찾을 수 없습니다."
        ) {
          alert("해당 회원을 찾을 수 없습니다.");
        } else if (
          response.payload.payload.error ===
          "아이디 혹은 비밀번호가 틀렸습니다."
        ) {
          alert("해당 회원을 찾을 수 없습니다.");
        }
      }
    });

    // Axios.post("/api/users/login", body).then((response) => {});
  };
  //  카카오 로그인 구현
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className={style.loginpage} onKeyDown={enterKeyPress}>
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
                onClick={() => navigate(`/`)}
                >
                  <i class="fi fi-rr-left"></i>
            </button>
          <div className={style.logo}>
            <img
              className={style.logoImage}
              src={process.env.PUBLIC_URL + "/image/logo/real_logo.png"}
              onClick={() => navigate(`/`)}
            ></img>
          </div>
          <div className={style.allBox}>
            <div className={style.idBox}>
              <div className={style.frontZone}></div>
              <input
                className={style.inputZone}
                placeholder="Email"
                type="email"
                value={Email}
                onChange={onEmailHandler}
              ></input>
            </div>
            <div className={style.pwBox}>
              <div className={style.frontZone}></div>
              <input
                className={style.inputZone}
                placeholder="Password"
                type="password"
                value={Password}
                onChange={onPasswordHandler}
              ></input>
            </div>
            <div className={style.loginDiv}>
              <button className={style.loginButton} onClick={onSubmitHandler}>
                로그인
              </button>
            </div>
            <div className={style.etcDiv}>
              <button
                className={style.registerButton}
                onClick={() => navigate(`/register`)}
              >
                회원가입
              </button>
              <button
                className={style.findPwButton}
                onClick={() => navigate(`/findpw`)}
              >
                비밀번호 찾기
              </button>
            </div>
            <div className={style.lineDiv}>
              <div className={style.line}></div>
              <div className={style.lineText}>또는</div>
              <div className={style.line}></div>
            </div>
            <div className={style.loginDiv}>
              <button
                className={style.kakaoButton}
                onClick={handleKakaoLogin}
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
