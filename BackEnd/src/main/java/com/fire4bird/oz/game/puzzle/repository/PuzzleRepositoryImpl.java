package com.fire4bird.oz.game.puzzle.repository;


import com.fire4bird.oz.game.puzzle.entity.Puzzle;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.game.puzzle.entity.QPuzzle.puzzle;

@RequiredArgsConstructor
public class PuzzleRepositoryImpl implements PuzzleRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    //퍼즐의 turn이 제일 높은 회차 찾기
    @Override
    public Puzzle maxTurn(int roundId) {

        Integer maxTurn = jpaQueryFactory
                .select(puzzle.turn.max())
                .from(puzzle)
                .where(puzzle.round.roundId.eq(roundId))
                .fetchOne();

        Puzzle puzzles = jpaQueryFactory
                .selectFrom(puzzle)
                .where(puzzle.round.roundId.eq(roundId)
                        .and(puzzle.turn.eq(maxTurn)))
                .fetchOne();
        return puzzles;
    }
}
