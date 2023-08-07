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
      <div className={style.standard}>
        <div className={style.box}>
          <form className={style.form} onSubmit={onSubmitHandler}>
            <div className={style.inputbox}>
              {/* <label>Name</label> */}
              <input
                className={style.input}
                type="text"
                value={Name}
                onChange={onNameHandler}
              />
            </div>
            <br />
            <div className={style.inputbox}>
              {/* <label>Nickname</label> */}
              <input
                className={style.input}
                type="text"
                value={NickName}
                onChange={onNickNameHandler}
              />
            </div>
            <br />
            <div className={style.inputbox}>
              {/* <label>Email</label> */}

              <input
                className={style.input}
                type="email"
                value={Email}
                onChange={onEmailHandler}
              />
            </div>
            <br />
            <button className={style.button} type="submit">
              회원수정
            </button>
          </form>
          <button
            className={style.button}
            onClick={() => navigate("/passwordchange")}
          >
            비밀번호 수정
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
