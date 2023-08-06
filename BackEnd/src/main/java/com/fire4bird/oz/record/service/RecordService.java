package com.fire4bird.oz.record.service;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.mapper.RecordMapper;
import com.fire4bird.oz.record.repository.RecordRepository;
import com.fire4bird.oz.round.service.RoundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecordService {

    private final RecordRepository recordRepository;
    private final RoundService roundService;
    private final RecordMapper recordMapper;

    //기록 검색
    public Record findRecord(int roundId, int stageNum) {
        return recordRepository.findByRecord(roundId, stageNum);
    }

    //기록 저장
    public void saveRecord(int roundId, int stageNum) {
        Record findRecord = findRecord(roundId, stageNum);

        //기록이 없으면
        findRecord = Optional.ofNullable(findRecord)
                .orElseGet(() -> recordMapper.toEntity(roundService.findRound(roundId), stageNum, LocalDateTime.now()));

        //이미 기록이 있으면
        Optional.of(findRecord)
                .ifPresent(fr -> fr.setChallengeTurn(fr.getChallengeTurn() + 1));

        recordRepository.save(findRecord);
    }

}
