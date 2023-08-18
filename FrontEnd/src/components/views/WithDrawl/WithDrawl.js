import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../_actions/user_action";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../_actions/axiosInstance";
import style from "./WithDrawl.module.css";

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
      const response = await axiosInstance.delete("users/resign", {
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
    <div className={style.WithDrawl}>
      <div className={style.box}>
      <button className={style.closeInputBox}
                onClick={() => navigate(`/mypage`)}
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
              <input className={style.inputZone}
              type="password"
              value={password}
              placeholder="현재 비밀번호를 입력해 주세요"
              onChange={onPasswordHandler}
              >
              </input>
            </div>
        </div>
        <div className={style.deleteDiv}>
              <button className={style.Button}
                onClick={withdrawlHandler}>회원 탈퇴</button>
        </div>
      </div>
    </div>
  );
};

export default WithDrawl;
