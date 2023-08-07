import { SET_GAME_USER_INFO } from "../_actions/types";

const initialState = {};

const gameUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GAME_USER_INFO:
      console.log(state);
      return {
        ...state,
        gameUsers: action.payload,
      };
    default:
      return state;
  }
};

export default gameUserReducer;
