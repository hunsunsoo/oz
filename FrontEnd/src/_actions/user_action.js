import { LOGIN_USER } from "./types";
import axiosInstance from "./axiosInstance";

export function loginUser(dataToSubmit) {
  const request = axiosInstance
    .post("/api/users/login", dataToSubmit)
    .then((response) => response);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  console.log(dataToSubmit);
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
// }
