import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage"; // 수정
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import AuthLandingPage from "./components/views/LandingPage/AuthLandingPage";
import GamePage from "./components/views/GamePage/GamePage";
import WithDrawl from "./components/views/WithDrawl/WithDrawl";
import PasswordChange from "./components/views/PasswordChange/PasswordChange";
import MyPage from "./components/views/MyPage/MyPage";
import { GameComp } from "./components/views/GamePage/GameComps/GameComps";
import SocketPage from "./components/views/SocketPage/SocketPage";
import KakaoLogin from "./components/views/LoginPage/KakoLogin";
import RankPage from "./components/views/RankPage/RankPage";
import FindPwPage from "./components/views/LoginPage/FindPwPage";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {createGlobalStyle} from "styled-components";

const GlobalStyles = createGlobalStyle`
    @font-face {
      font-family: 'ImcreSoojin';
      src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.3/ImcreSoojin.woff') format('woff');
      font-weight: normal;
      font-style: normal;
    }

    * {
      font-family: 'ImcreSoojin';
    }
`;

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="App">
          <GlobalStyles />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/authlanding" element={<AuthLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kakaoLogin" element={<KakaoLogin />} />
            <Route path="/findpw" element={<FindPwPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/withdrawl" element={<WithDrawl />} />
            <Route path="/passwordchange" element={<PasswordChange />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/rank" element={<RankPage />} />
            <Route path="/play" element={<GameComp />} />
            <Route path="/socket" element={<SocketPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DndProvider>
  );
}

export default App;
