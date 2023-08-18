import { combineReducers } from "redux";
// import userReducer from "./user_reducer";
// store 안에는 user reducer, comment reducer 등 수많은 reducer들이 있다.
// combine reducer는 그것들을 묶어 root reducer에서 하나로 합쳐준다.
import user from "./user_reducer";
import gameUserReducer from "./game_reducer";
const rootReducer = combineReducers({
  user,
  gameUserReducer,
});

export default rootReducer;
