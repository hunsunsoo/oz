package com.fire4bird.oz.rank.service;

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

    //각 스테이지 조회 결과
    public List<Tuple> findTotalRank(int stageNum) {
        return recordRepository.findTotalRank(stageNum);
    }

    public void test(int stageNum){
        recordRepository.findMyRank(stageNum,1);
    }
}
