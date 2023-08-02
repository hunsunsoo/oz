package com.fire4bird.oz.game.calculation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitLogReq {
    private Integer roundId;
    private Integer userId;
    private boolean isSystem;
    private int logType;
    private String message;

}
