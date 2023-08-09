import { LOGIN_USER, LOGOUT_USER, KAKAOLOGIN_USER } from "./types";
import axiosInstance from "./axiosInstance";
import axios from "axios";
export function loginUser(dataToSubmit) {
  const request = axiosInstance
    .post("users/login", dataToSubmit)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      const errorMessage =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "로그인 중 오류가 발생했습니다.";
      // console.log(errorMessage);
      return {
        type: LOGIN_USER,
        payload: { error: errorMessage },
      };
    });
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function kakaoLoginUser(dataToSubmit) {
  const code = dataToSubmit;
  const request = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: `http://localhost:8080/api/oauth/kakao?code=${code}`,
        // headers: {
        //   "Content-Type": "application/json;charset=utf-8", //json형태로 데이터를 보내겠다는뜻
        //   "Access-Control-Allow-Origin": "*", //이건 cors 에러때문에 넣어둔것. 당신의 프로젝트에 맞게 지워도됨
        // },
      });

      console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "로그인 중 오류가 발생했습니다.";

      return {
        type: KAKAOLOGIN_USER,
        payload: { error: errorMessage },
      };
    }
  };

  return {
    type: KAKAOLOGIN_USER,
    payload: request(),
  };
}
export function logoutUser(accessToken, refreshtoken) {
  const request = axiosInstance
    .post("users/login", {
      header: {
        AccessToken: accessToken,
        Refreshtoken: refreshtoken,
      },
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      const errorMessage =
        err.response && err.response.data && err.response.data.msg
          ? err.response.data.msg
          : "로그인 중 오류가 발생했습니다.";
    });

  return {
    type: LOGOUT_USER,
  };
}

export function registerUser(dataToSubmit) {
  const request = axiosInstance
    .post("users/signup", dataToSubmit)
    .then((response) => response.data)
    .catch((err) => {
      alert(err.response.data.msg);
    });

  return {
    type: "REGISTER_USER",
    payload: request,
  };
}

export function emailAvailable(dataToSubmit){
  const request = async () => {
    try {
      const response = await axiosInstance.post("/users/mail", dataToSubmit);
      console.log(response.data);

      return response;
    } catch (error) {
      return{
        type: "EMAIL_CHECK",
        payload: {error: "올바르지 않은 이메일입니다"},
      };
    }
  };

  return{
    type: "EMAIL_CHECK",
    payload: request(),
  };
}

// export function auth() {
//   const request = axiosInstance
//     .get("/api/users/auth")
//     .then((response) => response.data);

//   return {
//     type: "AUTH_USER",
//     payload: request,
//   };
// }'
