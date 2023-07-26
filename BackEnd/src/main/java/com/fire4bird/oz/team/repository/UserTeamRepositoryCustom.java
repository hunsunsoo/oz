package com.fire4bird.oz.team.repository;

import java.util.List;

public interface UserTeamRepositoryCustom {
    int findTeamIdByUserId(List<Integer> userId);
}
