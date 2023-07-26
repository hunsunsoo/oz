package com.fire4bird.oz.team.repository;

import com.fire4bird.oz.team.entity.UserTeam;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class UserTeamRepositoryImpl implements UserTeamRepositoryCustom{
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public int findTeamIdByUserId(List<Integer> userId) {

        return 0;
    }
}
