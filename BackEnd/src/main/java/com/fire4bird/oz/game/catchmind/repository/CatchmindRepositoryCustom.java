package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.Drawing;

public interface CatchmindRepositoryCustom {
    Drawing maxTurn(int roundId);

    long countTurn(int roundId);
}
