package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitAnswerReq {
    private Integer userId;
    private Integer gameId;
    private String numbers;
    private String marks;
}
