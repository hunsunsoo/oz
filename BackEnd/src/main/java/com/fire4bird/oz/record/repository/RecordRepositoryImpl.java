package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.user.entity.User;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.round.entity.QRound.round;
import static com.fire4bird.oz.team.entity.QUserTeam.userTeam;

@RequiredArgsConstructor
@Slf4j
public class RecordRepositoryImpl implements RecordRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Optional<UserTeam> validUserToRound(User user, Round round) {
        return Optional.ofNullable(jpaQueryFactory
                .selectFrom(userTeam)
                .where(userTeam.team.eq(round.getTeam()),
                        userTeam.user.eq(user))
                .fetchOne());
    }

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
    public List<LocalTime> findByTimeRecord(int roundId, int stageNum) {
        return jpaQueryFactory
                .select(record.stageRecord)
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.stageNum.eq(stageNum))
                .fetch();
    }

    @Override
    public List<LocalTime> findByClearRecord(int roundId) {

        return jpaQueryFactory
                .select(record.accRecord)
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.clear.eq("clear"),
                        record.accRecord.isNotNull())
                .fetch();
    }
}
