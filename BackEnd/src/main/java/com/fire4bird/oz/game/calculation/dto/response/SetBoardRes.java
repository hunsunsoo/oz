package com.fire4bird.oz.game.calculation.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetBoardRes {
    private int gameId;
    private int[][] numberBoard;
    private int turn;
    private String session;
}
