package com.fire4bird.oz.game.trap.repository;

import com.fire4bird.oz.game.trap.entity.Trap;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.game.trap.entity.QTrap.trap;

@RequiredArgsConstructor
public class TrapRepositoryImpl implements TrapRepositoryCustom{
    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public Trap maxTurn(int roundId) {
        Integer maxTurn = jpaQueryFactory
                .select(trap.turn.max())
                .from(trap)
                .where(trap.round.roundId.eq(roundId))
                .fetchOne();

        Trap targetTrap = jpaQueryFactory
                .selectFrom(trap)
                .where(trap.round.roundId.eq(roundId).and(trap.turn.eq(maxTurn)))
                .fetchOne();

        return targetTrap;
    }
}
