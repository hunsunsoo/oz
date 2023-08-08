package com.fire4bird.oz.rank.service;

import com.fire4bird.oz.rank.dto.MyRankDto;
import com.fire4bird.oz.rank.mapper.RankMapper;
import com.fire4bird.oz.record.repository.RecordRepository;
import com.querydsl.core.Tuple;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class RankService {
    private final RecordRepository recordRepository;
    private final RankMapper rankMapper;

    //각 스테이지 조회 결과
    public List<Tuple> findTotalRank(int stageNum) {
        return recordRepository.findTotalRank(stageNum);
    }

    public List<MyRankDto> findMyRank(int stageNum,int userId){
        List<Tuple> myRank = recordRepository.findMyRank(stageNum, userId);
        List<Long> rankNum = recordRepository.getRankNum(myRank, stageNum);

        log.info("myRank size : {}", myRank.size());
        log.info("rankNum size : {}", rankNum.size());

        return rankMapper.toMyRankDto(myRank, rankNum);
    }
}
