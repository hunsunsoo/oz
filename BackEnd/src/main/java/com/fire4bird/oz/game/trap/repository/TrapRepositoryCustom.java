package com.fire4bird.oz.game.trap.repository;

import com.fire4bird.oz.game.trap.entity.Trap;

public interface TrapRepositoryCustom {

    Trap maxTurn(int roundId);
}
