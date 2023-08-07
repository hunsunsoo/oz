package com.fire4bird.oz.record.service;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.mapper.RecordMapper;
import com.fire4bird.oz.record.repository.RecordRepository;
import com.fire4bird.oz.round.service.RoundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    //스테이지 시작 시 기록
    public void saveStartRecord(int roundId, int stageNum) {
        Record findRecord = findRecord(roundId, stageNum);

        Record newRecord = recordMapper.toStartEntity(roundService.findRound(roundId), stageNum, LocalDateTime.now(), 1);

        //이미 기록이 있으면
        Optional.ofNullable(findRecord)
                .ifPresent(fr -> newRecord.setChallengeTurn(fr.getChallengeTurn() + 1));

        recordRepository.save(newRecord);
    }

    //(clear) (fail, error) 분기 및 저장
    public void clearCheck(int roundId, int stageNum, String clear) {
        Record record = saveEndRecord(roundId, stageNum, clear);

        if (clear.equals("clear")) {
            saveClearRecord(roundId, stageNum, record);
        }

        if (clear.equals("clear") && stageNum == 4) {
            saveTotalRecord(roundId);
        }
    }

    //스테이지 종료 시 기록 저장 - error or false
    public Record saveEndRecord(int roundId, int stageNum, String clear) {
        Record findRecord = findRecord(roundId, stageNum);
        log.info("findRecord : {}", findRecord);

        findRecord.setEndTime(LocalDateTime.now());
        findRecord.setClear(clear);
        log.info("findRecord : {}", findRecord);

        return recordRepository.save(stageRecordCalculation(findRecord));
    }

    //스테이지 종료시 기록 저장 - clear
    public void saveClearRecord(int roundId, int stageNum, Record record) {
        List<LocalDateTime> findTimeRecord = recordRepository.findByTimeRecord(roundId, stageNum);

        record.setAccRecord(accRecordCalculation(findTimeRecord));

        recordRepository.save(record);
    }

    //종합 기록 저장
    public void saveTotalRecord(int roundId) {
        List<LocalDateTime> clearRecord = recordRepository.findByClearRecord(roundId);

        Record totalRecord = recordMapper
                .toTotalRecordEntity(roundService.findRound(roundId), 5, accRecordCalculation(clearRecord),"clear");

        recordRepository.save(totalRecord);
    }

    //종료시간 - 시작 시간
    public Record stageRecordCalculation(Record findRecord) {
        LocalDateTime stageRecord = findRecord.getEndTime()
                .minusSeconds(findRecord.getStartTime().getSecond())
                .minusMinutes(findRecord.getStartTime().getMinute())
                .minusHours(findRecord.getStartTime().getHour());

        log.info("newTime : {}", stageRecord);

        findRecord.setStageRecord(stageRecord);

        return findRecord;
    }

    //clear 시 해당 스테이지 최종 누적 기록
    public LocalDateTime accRecordCalculation(List<LocalDateTime> recordList) {
        LocalDateTime accRecord = recordList.get(0);

        for (int i = 1; i < recordList.size(); i++) {
            accRecord = accRecord
                    .plusSeconds(recordList.get(i).getSecond())
                    .plusMinutes(recordList.get(i).getMinute())
                    .plusHours(recordList.get(i).getHour());

            log.info("accRecord : {}", accRecord);
        }
        return accRecord;
    }
}
