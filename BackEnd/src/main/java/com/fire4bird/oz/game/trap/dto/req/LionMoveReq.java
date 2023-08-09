package com.fire4bird.oz.game.trap.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LionMoveReq {

    private String rtcSession;

    private int turn;

    private int userId;

    // L R Go
    private String moving;
}
