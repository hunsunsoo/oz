package com.fire4bird.oz.team.repository;

import com.fire4bird.oz.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Integer> {
    boolean existsByTeamName(String teamName);

    Optional<Team> findByTeamId(Integer teamId);
}
