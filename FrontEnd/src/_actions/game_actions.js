import { SET_GAME_USER_INFO } from "./types";

export const setGameUserInfo = (gameUserInfo) => ({
  type: SET_GAME_USER_INFO,
  payload: gameUserInfo,
});
