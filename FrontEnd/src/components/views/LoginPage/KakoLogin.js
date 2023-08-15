import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthLandingPage from "../LandingPage/AuthLandingPage";
import { kakaoLoginUser } from "../../../_actions/user_action";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const KakoLogin = () => {
  const [cookies, setCookies] = useCookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  //이전에 로그인 페이지에서 이동 후 -> 내가 지정해준 카카오 리다이렉트 페이지로 이동
  // 그렇기에 use effect를 통해서 페이지 옮기자 마자 바로 리덕스/axios 처리해준다.
  useEffect(() => {
    const fetchKakaoUser = async () => {
      await dispatch(kakaoLoginUser(code)).then((response) => {
        console.log(response);
        if (response.payload.status === 200) {
          const Atoken = response.payload.headers.accesstoken;
          const Rtoken = response.payload.headers.refreshtoken;
          setCookies("Atoken", Atoken);
          setCookies("Rtoken", Rtoken);
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
      });
    };
    fetchKakaoUser();
  }, [dispatch, code, navigate, setCookies]);
};

export default KakoLogin;
