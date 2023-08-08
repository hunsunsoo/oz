package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorLogReq {
    private Integer roundId;
    private Integer userId;
    private char value;
}
