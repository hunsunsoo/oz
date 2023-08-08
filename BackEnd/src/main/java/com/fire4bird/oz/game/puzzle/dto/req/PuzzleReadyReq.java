package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Getter;

@Getter
public class PuzzleReadyReq {
    private int role;
    private int state;
    private String rtcSession;
}
