package com.fire4bird.oz.rank.service;

import com.fire4bird.oz.rank.dto.MyRankDto;
import com.fire4bird.oz.rank.dto.RankResponseDto;
import com.fire4bird.oz.rank.dto.TeamRecordDto;
import com.fire4bird.oz.rank.dto.TotalRankDto;
import com.fire4bird.oz.rank.mapper.RankMapper;
import com.fire4bird.oz.record.repository.RecordRepository;
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

    public RankResponseDto findMyRank(int userId, int stageNum) {
        List<Object[]> totalRankTest = recordRepository.findTotalRankTest(stageNum);
        List<Object[]> myRankTest = recordRepository.findMyRankTest(userId, stageNum);

        List<TotalRankDto> totalRankDtos = rankMapper.totalRankListToList(totalRankTest);
        List<MyRankDto> myRankDtos = rankMapper.myRankListToList(myRankTest);

        return rankMapper.toRankResponseDto(totalRankDtos, myRankDtos);
    }

    //게임이 다 끝나고 바로 나오는 해당 팀의 기록
    public TeamRecordDto findTeamRank(int roundId) {
        return recordRepository.findTeamRecord(roundId);
    }
}
