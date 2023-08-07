package com.fire4bird.oz.record.controller;

import com.fire4bird.oz.common.CMRespDto;
import com.fire4bird.oz.record.dto.RecordRegistDto;
import com.fire4bird.oz.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/record")
@RequiredArgsConstructor
@Slf4j
public class RecordController {
    private final RecordService recordService;

    //스테이지 시작
    //게임 시작 시간 및 도전 횟수 저장
    @PostMapping("/start")
    public ResponseEntity startRecordSave(@RequestBody RecordRegistDto recordRegistDto) {
        recordService.saveStartRecord(recordRegistDto.getRoundId(), recordRegistDto.getStageNum());

        return ResponseEntity.ok()
                .body(new CMRespDto<>(1,"기록 저장 성공",null));
    }

    //스테이지 종료
    //게임 종료 시간 및 clear 여부 저장
    @PostMapping("/end")
    public ResponseEntity endRecordSave(@RequestBody RecordRegistDto recordRegistDto) {
        recordService.clearCheck(recordRegistDto.getRoundId(), recordRegistDto.getStageNum(), recordRegistDto.getClear());

        return ResponseEntity.ok()
                .body(new CMRespDto<>(1,"기록 저장 성공",null));
    }

}
