package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelperSubmitReq {
    private Integer userId;
    private Integer roundId;
    private int role;
    private int selected;
    private int r;
    private int c;
}