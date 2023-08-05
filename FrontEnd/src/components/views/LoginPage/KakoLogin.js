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
            navigate("/authlanding");
          }, 0);
        }
      });
    };
    fetchKakaoUser();
  }, [dispatch, code, navigate, setCookies]);
};

export default KakoLogin;
