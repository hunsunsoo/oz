package com.fire4bird.oz.game.puzzle.dto.req;

import lombok.Getter;

@Getter
public class PuzzleLogDto {
    private Integer userId;

    private Integer isSystem;

    private Integer logType;

    private String message;
}
