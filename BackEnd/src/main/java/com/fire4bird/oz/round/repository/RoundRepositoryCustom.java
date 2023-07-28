package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.Team;

import java.util.List;
import java.util.Optional;

public interface RoundRepositoryCustom {

    Round recentRound(Team team);

}
