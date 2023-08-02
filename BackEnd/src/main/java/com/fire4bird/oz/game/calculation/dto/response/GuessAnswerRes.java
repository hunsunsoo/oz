package com.fire4bird.oz.game.calculation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class GuessAnswerRes {
    private final Integer userId;
    private final boolean isCorrect;
    private final boolean isGameEnd;
    private final int number;
}
