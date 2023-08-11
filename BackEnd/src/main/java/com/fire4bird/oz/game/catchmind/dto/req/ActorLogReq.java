package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorLogReq {
    private int userId;
    private String userAnswer;
    private String rtcSession;
}
