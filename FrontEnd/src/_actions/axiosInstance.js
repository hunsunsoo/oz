// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080", // 여기에 원하는 포트를 지정하세요 (예: 8080)
  // baseURL:"https://i9b104.p.ssafy.io"
  baseURL:"https://i9b104.p.ssafy.io/api",
});

export default axiosInstance;
