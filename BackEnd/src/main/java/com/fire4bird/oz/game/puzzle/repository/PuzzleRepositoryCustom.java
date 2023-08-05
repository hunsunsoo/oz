package com.fire4bird.oz.game.puzzle.repository;

import com.fire4bird.oz.game.puzzle.entity.Puzzle;

public interface PuzzleRepositoryCustom {

    Puzzle maxTurn(int roundId);

}
