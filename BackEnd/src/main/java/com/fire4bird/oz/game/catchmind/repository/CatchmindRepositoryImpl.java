package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.Catchmind;
import com.fire4bird.oz.game.catchmind.entity.QCatchmind;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.game.catchmind.entity.QCatchmind.catchmind;

@RequiredArgsConstructor
public class CatchmindRepositoryImpl implements  CatchmindRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    // turn이 제일 높은 회차 찾기
    @Override
    public Catchmind maxTurn(int roundId) {
        Catchmind catchminds = jpaQueryFactory
                .select(catchmind)
                .where(catchmind.round.roundId.eq(roundId)
                        .and(catchmind.turn.eq(
                                jpaQueryFactory
                                        .select(catchmind.turn.max())
                                        .from(catchmind)
                                        .where(catchmind.round.roundId.eq(roundId))
                                        .fetchOne()
                        )))
                .from(catchmind)
                .fetchOne();
        return catchminds;
    }
}
