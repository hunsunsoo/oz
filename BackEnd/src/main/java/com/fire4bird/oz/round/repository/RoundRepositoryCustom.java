package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.Team;

public interface RoundRepositoryCustom {

    Round recentRound(Team team);

}
