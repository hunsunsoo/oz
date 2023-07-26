package com.fire4bird.oz.team.repository;

import com.fire4bird.oz.team.entity.QUserTeam;
import static com.fire4bird.oz.team.entity.QTeam.team;
import static com.fire4bird.oz.team.entity.QUserTeam.userTeam;

import com.fire4bird.oz.team.entity.UserTeam;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;


@RequiredArgsConstructor
public class UserTeamRepositoryImpl implements UserTeamRepositoryCustom{
    private final JPAQueryFactory jpaQueryFactory;

    // 모든 멤버가 들어 있는
    @Override
    public List<Integer> findTeamIdByUserId(List<Integer> userId) {
        List<Integer> ans = jpaQueryFactory
                .select(userTeam.team.teamId)
                .from(userTeam)
                .where(userTeam.user.userId.in(userId))
                .groupBy(userTeam.team.teamId)
                .having(userTeam.team.teamId.count().goe(4))
                .fetch();

        return ans;
    }
}
