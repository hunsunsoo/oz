package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.user.entity.User;
import com.querydsl.core.Tuple;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface RecordRepositoryCustom {

    //유저와 round의 관계가 유효한 지 확인
    Optional<UserTeam> validUserToRound(User user, Round round);

    //기록 찾아오기
    Record findByRecord(int roundId, int stageNum);

    //클리어시 사용될 기록 찾아오기 - 시간 데이터만 리스트로
    List<LocalTime> findByTimeRecord(int roundId, int stageNum);

    //해당 회차의 1 ~ 4의 클리어기록 조회
    List<LocalTime> findByClearRecord(int roundId);

    //스테이지 별 랭킹 기록
    List<Tuple> findTotalRank(int stageNum);

    //해당 유저 스테이지 별 기록 - limit(3)
    List<Tuple> findMyRank (int stageNum, int userId);

    //유저 스테이지 별 기록 랭크 숫자 세팅
    List<Long> getRankNum(List<Tuple> findMyRank, int stageNum);
}
