package com.fire4bird.oz.team.repository;

import com.fire4bird.oz.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Integer> {
    boolean existsByTeamName(String teamName);

    Optional<Team> findByTeamId(Integer teamId);

    Optional<Team> findByTeamName(String teamName);
}
