package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PuzzleStartReq {

    private String rtcSession;

    private int userId;
}
