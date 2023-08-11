package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Data;
import lombok.Getter;

@Data
public class PuzzleLogReq {
    private int userId;
    private String message;
    private String rtcSession;
}
