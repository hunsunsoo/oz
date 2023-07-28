package com.fire4bird.oz.round.repository;

import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.Team;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import static com.fire4bird.oz.round.entity.QRound.round;

@RequiredArgsConstructor
public class RoundRepositoryImpl implements RoundRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    //팀 찾기 //round안에 회차가 제일 높은..
    @Override
    public Round recentRound(Team team) {
        Round ans = jpaQueryFactory
                .select(round)
                .where(round.teamRound.eq(jpaQueryFactory.select(round.teamRound.max()).from(round).where(round.team.eq(team))))
                .from(round)
                .fetchOne();

//        if (ans == null) {
//            // 조회 결과가 없을 경우, 적절한 처리를 수행하거나 예외를 던질 수 있습니다.
//            throw new EntityNotFoundException("No entity found with the given team.");
//        }

        return ans;

    }
}
