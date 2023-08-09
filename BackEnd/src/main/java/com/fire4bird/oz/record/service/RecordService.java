package com.fire4bird.oz.record.service;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.mapper.RecordMapper;
import com.fire4bird.oz.record.repository.RecordRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.service.RoundService;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecordService {

    private final RecordRepository recordRepository;
    private final UserService userService;
    private final RoundService roundService;
    private final RecordMapper recordMapper;
    
    //해당 라운드 해당 스테이지에 이미 클리어 기록이 있는 경우 도전 불가

    //유저와 라운드id의 관계가 유효한 지 확인
    public void validUserAndRound(int userId, int roundId) {
        User user = userService.findUser(userId);
        Round round = roundService.findRound(roundId);

        Optional<UserTeam> findUserTeam = recordRepository.validUserToRound(user, round);

        //요청 유저가 이상한 라운드id로 요청 보내면 throw
        findUserTeam
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.BAD_REQUEST));
    }

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
        //조회 기록이 없으면 도전 기록이 없음
        //여기서 예외처리 해야함


        findRecord.setEndTime(LocalDateTime.now());
        findRecord.setClear(clear);
        log.info("findRecord : {}", findRecord);

        return recordRepository.save(stageRecordCalculation(findRecord));
    }

    //스테이지 종료시 기록 저장 - clear
    public void saveClearRecord(int roundId, int stageNum, Record record) {
        List<LocalTime> findTimeRecord = recordRepository.findByTimeRecord(roundId, stageNum);

        record.setAccRecord(accRecordCalculation(findTimeRecord));

        recordRepository.save(record);
    }

    //종합 기록 저장
    public void saveTotalRecord(int roundId) {
        List<LocalTime> clearRecord = findClearRecord(roundId);

        Record totalRecord = recordMapper
                .toTotalRecordEntity(roundService.findRound(roundId), 5, accRecordCalculation(clearRecord), "clear");

        recordRepository.save(totalRecord);
    }

    //종료시간 - 시작 시간
    public Record stageRecordCalculation(Record findRecord) {
        LocalDateTime stageRecord = findRecord.getEndTime()
                .minusSeconds(findRecord.getStartTime().getSecond())
                .minusMinutes(findRecord.getStartTime().getMinute())
                .minusHours(findRecord.getStartTime().getHour());

        log.info("newTime : {}", stageRecord);

        findRecord.setStageRecord(stageRecord.toLocalTime());

        return findRecord;
    }

    //클리어 계산을 위한 이전 기록 4개 긁어옴
    public List<LocalTime> findClearRecord(int roundId) {
        List<LocalTime> clearRecord = recordRepository.findByClearRecord(roundId);

        //해당 부분 리스트 사이즈 4가 아니면 예외 처리 진행
        if(clearRecord.size() != 4){
            throw new BusinessLogicException(ExceptionCode.BAD_REQUEST);
        }

        return clearRecord;
    }

    //clear 시 해당 스테이지 최종 누적 기록
    public LocalTime accRecordCalculation(List<LocalTime> recordList) {
        LocalTime accRecord = recordList.get(0);

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
