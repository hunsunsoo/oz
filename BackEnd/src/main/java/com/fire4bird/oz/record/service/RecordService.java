package com.fire4bird.oz.record.service;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.mapper.RecordMapper;
import com.fire4bird.oz.record.repository.RecordRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.service.RoundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
        if (findRecord == null) {
            Round round = roundService.findRound(roundId);

            Record record = recordMapper.toEntity(round, stageNum);

            record.setChallengeTurn(1);
            recordRepository.save(record);
        }

    }

}
