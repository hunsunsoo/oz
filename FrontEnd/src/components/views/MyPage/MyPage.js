import React, { useState, useEffect } from "react";
import axiosInstance from "../../../_actions/axiosInstance";
import { useSelector } from "react-redux";
function MyPage(props) {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [NickName, setNickName] = useState("");

  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );

  useEffect(() => {
    // 여기서 현재 로그인된 사용자의 정보를 불러옵니다.
    console.log(accessToken);
    axiosInstance
      .get("/users/mypage", {
        headers: {
          AccessToken: accessToken,
        },
      })
      .then((response) => {
        console.log(response.data);
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
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <label>Nickname</label>
        <input type="text" value={NickName} onChange={onNickNameHandler} />
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <button type="submit">회원수정</button>
      </form>
    </div>
  );
}

export default MyPage;
