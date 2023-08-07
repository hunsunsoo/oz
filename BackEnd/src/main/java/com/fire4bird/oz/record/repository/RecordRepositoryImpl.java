package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.QUserRound;
import com.fire4bird.oz.user.entity.QUser;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.round.entity.QRound.round;
import static com.fire4bird.oz.round.entity.QUserRound.userRound;
import static com.fire4bird.oz.team.entity.QTeam.team;
import static com.fire4bird.oz.user.entity.QUser.user;

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
    public void findToMyRank(int stageNum, int userId) {
//        jpaQueryFactory
//                .select()
//                .from(record)
//                .join(userRound.user, user).on(user.userId.eq(userId))

    }
}
