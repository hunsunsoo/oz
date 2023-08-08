package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.user.entity.User;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.round.entity.QRound.round;
import static com.fire4bird.oz.round.entity.QUserRound.userRound;
import static com.fire4bird.oz.team.entity.QTeam.team;
import static com.fire4bird.oz.team.entity.QUserTeam.userTeam;
import static com.fire4bird.oz.user.entity.QUser.user;
import static com.querydsl.jpa.JPAExpressions.select;

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

    @Override
    public List<Tuple> findTotalRank(int stageNum) {
        String clear = "clear";

        return jpaQueryFactory
                .select(
                        record.accRecord.hour(),
                        record.accRecord.minute(),
                        record.accRecord.second(),
                        team.teamName)
                .from(record)
                .join(record.round, round)
                .join(round.team, team)
                .where(record.stageNum.eq(stageNum),
                        record.clear.eq(clear))
                .orderBy(record.accRecord.asc())
                .fetch();
    }

    @Override
    public List<Tuple> findMyRank(int stageNum, int userId) {
        String clear = "clear";

        return jpaQueryFactory
                .select(record.accRecord,
                        round.team.teamName)
                .from(record)
                .where(record.round.roundId.in(
                                select(userRound.round.roundId)
                                        .from(userRound)
                                        .join(userRound.user, user).on(user.userId.eq(userId))),
                        record.stageNum.eq(stageNum),
                        record.clear.eq(clear))
                .orderBy(record.accRecord.asc())
                .limit(3)
                .fetch();
    }

    //몇 등인지 반환
    @Override
    public List<Long> getRankNum(List<Tuple> findMyRank, int stageNum) {
        List<Long> rankList = new ArrayList<>();
        for (Tuple tuple : findMyRank) {
            Long count = jpaQueryFactory
                    .select(record.accRecord.count())
                    .from(record)
                    .where(record.accRecord.lt(tuple.get(record.accRecord)),
                            record.stageNum.eq(stageNum))
                    .fetchOne();
            rankList.add(count + 1);
        }

        return rankList;
    }
}
