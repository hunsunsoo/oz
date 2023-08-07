package com.fire4bird.oz.game.calculation.repository;

import com.fire4bird.oz.game.calculation.entity.Calculation;
import com.fire4bird.oz.game.calculation.entity.QCalculation;
import com.fire4bird.oz.round.entity.Round;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CalculationRepositoryImpl implements CalculationRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;


    // 사칙연산 게임의 회차가 가장 높은 Round 찾기
    @Override
    public Calculation recentCalculation(Round round) {
        Calculation cal = jpaQueryFactory
                .select(QCalculation.calculation)
                .where(QCalculation.calculation.turn.eq(
                        jpaQueryFactory
                                .select(QCalculation.calculation.turn.max())
                                .from(QCalculation.calculation)
                                .where(QCalculation.calculation.round.eq(round)))
                .and(QCalculation.calculation.round.eq(round)))
                .from(QCalculation.calculation)
                .fetchOne();

        return cal;
    }
}
