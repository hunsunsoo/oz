package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class PuzzleAnswerReq {

    private String rtcSession;
    private int userId;
    private String userAnswer;
    private int check;//(-1 틀림,1 정답)

}
