package com.fire4bird.oz.game.calculation.repository;


import com.fire4bird.oz.game.calculation.entity.Calculation;
import com.fire4bird.oz.round.entity.Round;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CalculationRepository extends JpaRepository<Calculation, Integer>, CalculationRepositoryCustom {
    Optional<Calculation> findByRound_RoundId(Integer roundId);
}
