package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class HelperSubmitReq {
    private int gameId;
    private char[] selectedNums;
}
