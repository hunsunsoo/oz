import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage"; // 수정
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import AuthLandingPage from "./components/views/LandingPage/AuthLandingPage";
import RoomPage from "./components/views/RoomPage/RoomPage";
import SelectRolePage from "./components/views/SelectRolePage/SelectRolePage"
import GamePlayPage from "./components/views/GamePlayPage/GamePlayPage";
import RunOv from "./OpenVidu/RunOV"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/authlanding" element={<AuthLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/waitingroom" element={<RoomPage/>}/>
          <Route path="/role" element={<SelectRolePage/>}/>
          <Route path="/gameplay" element={<GamePlayPage/>}/>
          <Route path="/runov" element={<RunOv/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
