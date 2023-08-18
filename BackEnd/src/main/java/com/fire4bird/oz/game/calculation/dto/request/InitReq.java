package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InitReq {
    private int roundId;
    private int answer;
    private String numberBoard;
}