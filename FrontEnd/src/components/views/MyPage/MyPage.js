import React, { useState, useEffect } from "react";
import axiosInstance from "../../../_actions/axiosInstance";
import { useSelector } from "react-redux";
import style from "./MyPage.module.css";
import { useNavigate } from "react-router-dom";
function MyPage(props) {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [NickName, setNickName] = useState("");
  const navigate = useNavigate();
  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );

  useEffect(() => {
    // 여기서 페이지 로드 되자마자 현재 로그인된 사용자의 정보를 불러온다.
    console.log(accessToken);
    axiosInstance
      .get("/users/mypage", {
        headers: {
          AccessToken: accessToken,
        },
      })
      .then((response) => {
        console.log(response.data);
        //  아래 || "" 이부분은 렌더링 오류 때문에 작성함
        // 만약 해당 값이 undefined, null 또는 falsy한 값이라면 빈 문자열로 초기화하겠다는 의미
        setEmail(response.data.data.email || "");
        setName(response.data.data.name || "");
        setNickName(response.data.data.nickname || "");
      });
  }, []);

  const onEmailHandler = (event) => setEmail(event.currentTarget.value);
  const onNameHandler = (event) => setName(event.currentTarget.value);
  const onNickNameHandler = (event) => setNickName(event.currentTarget.value);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    const userUpdateData = {
      email: Email,
      name: Name,
      nickname: NickName,
    };

    axiosInstance
      .put("/users/update", userUpdateData, {
        headers: {
          AccessToken: accessToken,
        },
      })
      .then((response) => {
        alert("회원 정보가 성공적으로 수정되었습니다.");
      })
      .catch((error) => {
        alert("회원 정보 수정에 실패하였습니다.");
      });
  };

  return (
    <div className={style.myPage}>
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
              type="email"
              value={Email}
              placeholder="Email"
              disabled
              >
              </input>
            </div>

            <div className={style.bottomBox}>
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

            <div className={style.registDiv}>
              <button className={style.Button}
                onClick={onSubmitHandler}>회원 등록하기</button>
            </div>
            <div className={style.changeDiv}>
              <button className={style.Button}
                onClick={() => navigate("/passwordchange")}>비밀번호 변경</button>
            </div>
          </div>
          </div>
        </div>
  );
}

export default MyPage;
