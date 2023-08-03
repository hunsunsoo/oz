package com.fire4bird.oz.game.puzzle.dto.res;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PuzzleStartDataDto {
    private String userId;

    private Integer roundId;

    //방 세션
    private Integer roomId;

    //도전횟수
    private Integer turn;

    //안보여지는 퍼즐
    @NotNull
    private List<PuzzleDTO> answerPuzzleList;
    //보여지는 퍼즐
    private List<PuzzleDTO> providePuzzleList;

    @Getter
    @Setter
    public static class PuzzleDTO {
        @NotNull
        private Integer userId;
        @NotNull
        private int role;//1:도로시 2:사자 3:허수아비 4:양철나무꾼
    }
}
