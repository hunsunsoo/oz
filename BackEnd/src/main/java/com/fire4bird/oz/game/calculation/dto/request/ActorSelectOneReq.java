package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorSelectOneReq {
    private Integer roundId;
    private Integer userId;
    private int r;
    private int c;
}