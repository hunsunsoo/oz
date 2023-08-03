package com.fire4bird.oz.game.calculation.repository;

import com.fire4bird.oz.game.calculation.entity.Calculation;
import com.fire4bird.oz.round.entity.Round;

public interface CalculationRepositoryCustom {
    Calculation recentCalculation(Round round);
}
