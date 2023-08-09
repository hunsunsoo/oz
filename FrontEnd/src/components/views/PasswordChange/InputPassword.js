import React from "react";
import { useState } from "react";
import style from "./InputPassword.module.css";
import axiosInstance from "../../../_actions/axiosInstance";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
const InputPassword = () => {
  const accessToken = useSelector(
    (state) => state.user.loginSuccess.headers.accesstoken
  );
  const [password, setPassword] = useState("");
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmitPasswordHandler = async (e) => {
    e.preventDefault();
    let body = {
      password: password,
    };

    try {
      console.log(accessToken);
      const response = await axiosInstance.put("/users/update", body, {
        headers: {
          AccessToken: accessToken,
        },
      });

      if (response.status === 200) {
        alert(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div>
        <div className={style.box}>
          <form className={style.form} onSubmit={onSubmitPasswordHandler}>
            <div className={style.inputbox}>
              <input
                className={style.input}
                type="password"
                value={password}
                onChange={onPasswordHandler}
                placeholder="변경할 비밀번호를 입력하세요"
              ></input>
            </div>
            <br></br>
            <button className={style.button}>비밀번호제출</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputPassword;
