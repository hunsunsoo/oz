package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.rank.dto.TeamRecordDto;
import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.user.entity.User;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
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

    //동적쿼리
    @Override
    public Record findByRecord(int roundId, int stageNum, String clear) {
        return jpaQueryFactory
                .select(record)
                .from(record)
                .join(record.round, round).on(round.roundId.eq(roundId))
                .where(record.stageNum.eq(stageNum),
                        clearEq(clear))
                .orderBy(record.challengeTurn.desc())
                .fetchFirst();
    }

    private static BooleanExpression clearEq(String clear) {
        return clear != null ? record.clear.eq(clear) : null;
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

    @Override
    public TeamRecordDto findTeamRecord(int roundId) {
        return jpaQueryFactory
                .select(Projections.fields(TeamRecordDto.class,
                        record.accRecord))
                .from(record)
                .where(record.round.roundId.eq(roundId),
                        record.stageNum.eq(5))
                .fetchOne();
    }
}
