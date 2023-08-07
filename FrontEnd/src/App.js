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
<<<<<<< HEAD

=======
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
>>>>>>> f13ee8e18b5bfeae522145fe0ea6ccaddcd426d8
function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/authlanding" element={<AuthLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kakaoLogin" element={<KakaoLogin />} />
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
