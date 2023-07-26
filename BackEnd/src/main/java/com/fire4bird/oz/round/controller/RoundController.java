package com.fire4bird.oz.round.controller;

import com.fire4bird.oz.CMRespDto;
import com.fire4bird.oz.round.dto.RoundDto;
import com.fire4bird.oz.round.service.RoundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/round")
public class RoundController {

    private final RoundService roundService;

    @PostMapping("/start")
    public ResponseEntity roundStart(@RequestBody RoundDto roundDto) {
        roundService.roundSave(roundDto);
        return new ResponseEntity<>(new CMRespDto<>(1,"모험 시작", roundDto), HttpStatus.OK);
    }

}
