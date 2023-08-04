package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Getter;

@Getter
public class PuzzleLogReq {
    private Integer userId;
    private Integer isSystem;
    private Integer logType;//1: 시스템 생성 2: 허수아비 행동 3: 조력자 행동 4: 기타
    private String message;
    private String rtcSession;
}
