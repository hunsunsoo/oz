package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.UserRound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRoundRepository extends JpaRepository<UserRound, Integer> {
    List<UserRound> findAllByRound_RoundId(Integer roundId);
}
