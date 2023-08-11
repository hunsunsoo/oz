package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorAnswerReq {
    private String rtcSession;
    private int userId;
    private String userAnswer;
    private int check; // (-1:틀림, 1:정답)
}
