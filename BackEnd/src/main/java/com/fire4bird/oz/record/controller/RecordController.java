package com.fire4bird.oz.record.controller;

import com.fire4bird.oz.record.dto.RecordRegistDto;
import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.service.RecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/record")
@RequiredArgsConstructor
@Slf4j
public class RecordController {
    private final RecordService recordService;

    //테스트 컨트롤러
    @GetMapping("/test")
    public ResponseEntity test(@RequestBody RecordRegistDto recordRegistDto) {
        Record record = recordService.findRecord(recordRegistDto.getRoundId(), recordRegistDto.getStageNum());
        recordService.saveRecord(recordRegistDto.getRoundId(), recordRegistDto.getStageNum());
        return null;
    }
}
