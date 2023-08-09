package com.fire4bird.oz.rank.controller;

import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.rank.dto.MyRankDto;
import com.fire4bird.oz.rank.dto.RankResponseDto;
import com.fire4bird.oz.rank.dto.TotalRankDto;
import com.fire4bird.oz.rank.mapper.RankMapper;
import com.fire4bird.oz.rank.service.RankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rank")
@RequiredArgsConstructor
@Slf4j
public class RankController {

    private final RankService rankService;
    private final RankMapper rankMapper;

    @GetMapping("/{stage-num}")
    public ResponseEntity findRank(@PathVariable("stage-num") int stageNum) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        List<TotalRankDto> totalRankList = rankMapper.toTotalRankDtoList(rankService.findTotalRank(stageNum));

        List<MyRankDto> myRankList = rankService.findMyRank(stageNum, Integer.parseInt(userId));

        RankResponseDto rankResponseDto = rankMapper.toRankResponseDto(totalRankList, myRankList);
        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(1, stageNum + "스테이지 조회결과", rankResponseDto));
    }

    @GetMapping("/test/{stage-num}")
    public ResponseEntity test(@PathVariable("stage-num") int stageNum) {
        List<Object[]> test = rankService.test(stageNum);

        List<TotalRankDto> totalRankDtos = rankMapper.totalRankListToList(test);

        RankResponseDto rankResponseDto = rankMapper.toRankResponseDto(totalRankDtos, null);

        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(1, stageNum + "스테이지 조회결과", rankResponseDto));
    }
}
