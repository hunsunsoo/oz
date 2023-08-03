import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../_actions/user_action";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../_actions/axiosInstance";

const WithDrawl = () => {
  const [cookies, setCookies] = useCookies();
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const withdrawlHandler = async (event) => {
    event.preventDefault();
    let body = {
      password: password,
    };
    console.log("Request Body:", body);

    try {
      const response = await axiosInstance.delete("/api/users/resign", {
        data: body,
        headers: {
          AccessToken: cookies.Atoken,
        },
      });
      console.log(response);
      if (response.data === "회원 탈퇴 완료") {
        // 로그아웃 관련 처리
        dispatch(logoutUser());
        setCookies("Atoken", "", { expires: new Date() });
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <form
        className="form"
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={withdrawlHandler}
      >
        <input type="password" value={password} onChange={onPasswordHandler} />
        <br />
        <button>회원탈퇴</button>

        <br />
      </form>
    </div>
  );
};

export default WithDrawl;
