package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team,Integer> {

    Optional<Team> findByTeamName(String teamName);

}
