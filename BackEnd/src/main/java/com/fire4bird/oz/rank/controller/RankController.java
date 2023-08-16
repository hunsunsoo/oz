package com.fire4bird.oz.rank.controller;

import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.rank.dto.RankResponseDto;
import com.fire4bird.oz.rank.dto.TeamRecordDto;
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

@RestController
@RequestMapping("/rank")
@RequiredArgsConstructor
@Slf4j
public class RankController {

    private final RankService rankService;
    private final RankMapper rankMapper;

    @GetMapping("/{stage-num}")
    public ResponseEntity getRank(@PathVariable("stage-num") int stageNum) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        RankResponseDto test = rankService.findMyRank(Integer.parseInt(userId), stageNum);

        return ResponseEntity
                .ok()
                .body(new CMRespDto<>(1, stageNum + "스테이지 조회결과", test));
    }

    @GetMapping("/team/{round-id}")
    public ResponseEntity getTeamRank(@PathVariable("round-id") int roundId) {
        TeamRecordDto teamRank = rankService.findTeamRank(roundId);

        return ResponseEntity.ok(teamRank);
    }
}
