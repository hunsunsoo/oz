package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Data;

@Data
public class AnswerReq {
    private String rtcSession;
    private int userId;
    private String userAnswer;
    private String png;
}
