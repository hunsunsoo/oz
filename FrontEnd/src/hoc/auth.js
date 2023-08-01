// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { auth } from "../_actions/user_action";
// const Auth = (SpecificComponent, option, adminRoute = null) => {
//   // SpecificComponent-> 컴포넌트 들어감 / option->null/true/false 중 한개 / adminRoute 기본은 null 아니면 지정하기
//   // null 은 아무나 출입가능
//   // true 로그인한 유저만 출입 가능
//   // false 로그인 한유저는 출입 x
//   function AutenticationCheck(props) {
//     const dispatch = useDispatch();
//     useEffect(() => {
//       dispatch(auth()).then((response) => {
//         console.log(response);
//       });
//     }, []);
//     return <SpecificComponent />;
//   }
//   return AutenticationCheck;
// };
// export default Auth;
