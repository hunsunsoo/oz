package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorResetReq {
    private Integer roundId;
    private Integer userId;
}
