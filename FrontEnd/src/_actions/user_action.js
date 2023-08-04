import { LOGIN_USER, LOGOUT_USER } from "./types";
import axiosInstance from "./axiosInstance";

export function loginUser(dataToSubmit) {
  console.log(dataToSubmit);
  const request = axiosInstance
    .post("/api/users/login", dataToSubmit)
    .then((response) => response)
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
export function logoutUser(dataToSubmit) {
  console.log(dataToSubmit);

  return {
    type: LOGOUT_USER,
  };
}

export function registerUser(dataToSubmit) {
  const request = axiosInstance
    .post("api/users/signup", dataToSubmit)
    .then((response) => response.data)
    .catch((err) => console.log(err));

  return {
    type: "REGISTER_USER",
    payload: request,
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
