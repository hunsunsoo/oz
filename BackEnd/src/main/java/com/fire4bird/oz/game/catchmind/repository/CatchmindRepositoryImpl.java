package com.fire4bird.oz.game.catchmind.repository;

import com.fire4bird.oz.game.catchmind.entity.Drawing;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.game.catchmind.entity.QDrawing.drawing;

@RequiredArgsConstructor
public class CatchmindRepositoryImpl implements  CatchmindRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    // turn이 제일 높은 회차 찾기
    @Override
    public Drawing maxTurn(int roundId) {
        Drawing catchminds = jpaQueryFactory
                .select(drawing)
                .where(drawing.round.roundId.eq(roundId)
                        .and(drawing.turn.eq(
                                jpaQueryFactory
                                        .select(drawing.turn.max())
                                        .from(drawing)
                                        .where(drawing.round.roundId.eq(roundId))
                                        .fetchOne()
                        )))
                .from(drawing)
                .fetchOne();
        return catchminds;
    }

    @Override
    public long countTurn(int roundId) {

        return jpaQueryFactory
                .select(drawing)
                .from(drawing)
                .where(drawing.round.roundId.eq(roundId))
                .fetchCount();
    }
}
