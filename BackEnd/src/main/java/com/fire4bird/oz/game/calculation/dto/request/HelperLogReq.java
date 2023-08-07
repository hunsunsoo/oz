package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelperLogReq {
    private Integer roundId;
    private Integer userId;
    private int isSelected;
    private char value;
}
