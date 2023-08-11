package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorResetReq {
    private String rtcSession;
    private int role;
    private int state;
}
