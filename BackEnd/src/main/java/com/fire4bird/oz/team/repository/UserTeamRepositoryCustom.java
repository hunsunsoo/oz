package com.fire4bird.oz.team.repository;

import java.util.List;

public interface UserTeamRepositoryCustom {
    List<Integer> findTeamIdByUserId(List<Integer> userId);
}
