package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class PuzzleStartReq {

    private String rtcSession;

    private int userId;
}
