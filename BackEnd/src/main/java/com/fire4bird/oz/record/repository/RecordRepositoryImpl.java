package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.round.entity.QRound.round;

@RequiredArgsConstructor
@Slf4j
public class RecordRepositoryImpl implements RecordRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Record findByRecord(int roundId, int stageNum) {
        return jpaQueryFactory
                .select(record)
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.stageNum.eq(stageNum))
                .orderBy(record.challengeTurn.desc())
                .fetchFirst();
    }

    @Override
    public List<LocalDateTime> findByTimeRecord(int roundId, int stageNum) {
        return jpaQueryFactory
                .select(record.stageRecord)
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.stageNum.eq(stageNum))
                .fetch();
    }

    @Override
    public List<LocalDateTime> findByClearRecord(int roundId) {
        return jpaQueryFactory
                .select(record.accRecord)
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.clear.eq("clear"),
                        record.accRecord.isNotNull())
                .fetch();
    }
}
