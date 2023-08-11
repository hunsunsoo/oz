package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorLogReq {
    private int roundId;
    private int userId;
    private char value;
}
