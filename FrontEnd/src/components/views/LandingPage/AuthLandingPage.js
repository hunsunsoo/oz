import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import React from "react";

function AuthLandingPage(props) {
  const [cookies, setCookies] = useCookies(); // 쿠키와 설정 함수, 삭제 함수 추출
  const navigate = useNavigate();

  const logOutHandler = () => {
    setCookies("Atoken", "", { expires: new Date() }); // "token" 쿠키 삭제
    navigate("/");
  };

  return (
    <div>
      <button onClick={() => logOutHandler()}>LogOut</button>
    </div>
  );
}

export default AuthLandingPage;
