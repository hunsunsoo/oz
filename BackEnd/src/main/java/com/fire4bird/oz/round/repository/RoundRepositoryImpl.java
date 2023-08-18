package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.Team;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.round.entity.QRound.round;

@RequiredArgsConstructor
public class RoundRepositoryImpl implements RoundRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    //팀의 회차가 제일 높은 Round 찾기
    @Override
    public Round recentRound(Team team) {
        return jpaQueryFactory
                .select(round)
                .where(round.teamRound.eq(jpaQueryFactory
                                .select(round.teamRound.max())
                                .from(round)
                                .where(round.team.eq(team)))
                        .and(round.team.eq(team)))
                .from(round)
                .fetchOne();
    }
}
