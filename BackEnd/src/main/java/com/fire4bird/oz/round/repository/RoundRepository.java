package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoundRepository extends JpaRepository<Round, Integer> {
    Optional<Round> findByTeam(Team team);

}
