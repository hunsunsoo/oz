package com.fire4bird.oz.game.trap.repository;

import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.fire4bird.oz.game.trap.entity.Trap;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.game.puzzle.entity.QPuzzle.puzzle;
import static com.fire4bird.oz.game.trap.entity.QTrap.trap;

@RequiredArgsConstructor
public class TrapRepositoryImpl implements TrapRepositoryCustom{
    private final JPAQueryFactory jpaQueryFactory;


    @Override
    public Trap maxTurn(int roundId) {
        Trap targetTrap = jpaQueryFactory
                .select(trap)
                .where(trap.round.roundId.eq(roundId)
                        .and(trap.turn.eq(
                                jpaQueryFactory
                                        .select(trap.turn.max())
                                        .from(trap)
                                        .where(trap.round.roundId.eq(roundId))
                                        .fetchOne()
                        )))
                .from(trap)
                .fetchOne();


        return targetTrap;
    }

    @Override
    public long countTurn(int roundId) {
        long count = jpaQueryFactory
                .select(trap)
                .from(trap)
                .where(trap.round.roundId.eq(roundId))
                .fetchCount();

        return count;
    }
}
