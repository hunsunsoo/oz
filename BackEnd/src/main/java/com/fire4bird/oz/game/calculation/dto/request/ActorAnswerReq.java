package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActorAnswerReq {
    private Integer gameId;
    private String selectedNums;
    private String marks;
}
