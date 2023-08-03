package com.fire4bird.oz.game.puzzle.dto.res;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PuzzleStartRoleDto {
    //방 세션
    private Integer roomId;
    //안보여지는 퍼즐
    private PuzzleDTO answerPuzzle;

    //보여지는 퍼즐
    private PuzzleDTO providePuzzle;

    @Getter
    @Setter
    public static class PuzzleDTO {
        @NotNull
        private int location;
        @NotNull
        private int puzzleId;
    }
}
