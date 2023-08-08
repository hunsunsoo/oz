package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Getter;
import lombok.Setter;

// 게임 생성 데이터, 정답 데이터
@Getter
@Setter
public class PuzzleAnswerReq {

    private String rtcSession;
    private int userId;
    private String userAnswer;
    private int check;//(-1 틀림,1 정답)

}
