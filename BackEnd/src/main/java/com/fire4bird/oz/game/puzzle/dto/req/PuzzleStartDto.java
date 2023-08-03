package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PuzzleStartDto {
    private String userId;

    //팀회차일련번호
    private Integer roundId;

    //방 세션
    private Integer roomId;

    //도전횟수
    private Integer turn;
}
