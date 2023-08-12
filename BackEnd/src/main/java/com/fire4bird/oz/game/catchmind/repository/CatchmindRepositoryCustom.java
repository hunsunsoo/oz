package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.Catchmind;

public interface CatchmindRepositoryCustom {
    Catchmind maxTurn(int roundId);
}
