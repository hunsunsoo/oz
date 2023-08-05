package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.round.entity.QRound.round;

@RequiredArgsConstructor
public class RecordRepositoryImpl implements RecordRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Record findByRecord(int roundId, int stageNum) {
        return jpaQueryFactory
                .select(Projections.fields(Record.class,
                        record.stageNum,
                        record.challengeTurn,
                        record.stageRecord,
                        record.accRecord,
                        record.startTime,
                        record.endTime,
                        record.clear,
                        record.round))
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.stageNum.eq(stageNum))
                .orderBy(record.challengeTurn.desc())
                .fetchFirst();
    }
}
