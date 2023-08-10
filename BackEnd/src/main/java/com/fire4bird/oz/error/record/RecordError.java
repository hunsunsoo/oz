package com.fire4bird.oz.error.record;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RecordError {

    private final RecordRepository recordRepository;

    //유효성 검사 - 스테이지 도전 시
    public void startRecordValid(Record findRecord) {
        if (findRecord != null) {
            String clear = findRecord.getClear();

            if (clear == null || !clear.equals("false")) {
                throw new BusinessLogicException(ExceptionCode.BAD_REQUEST);
            }
        }
    }

    //스테이지 종료되었을 때
    public void endRecordValid(Record findRecord) {

        Optional.ofNullable(findRecord)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.NO_CHALLENGE_RECORD));


        Optional.ofNullable(findRecord.getClear())
                .ifPresent(v -> {
                    throw new BusinessLogicException(ExceptionCode.NO_CHALLENGE_RECORD);
                });
    }

    //스테이지 번호 유효성 검사
    public void stageNumValid(int stageNum,int roundId) {
        if (stageNum < 1 || stageNum > 4) {
            throw new BusinessLogicException(ExceptionCode.STAGE_NUM_NOT_VALID);
        }

        noRecentRecord(stageNum,roundId);
    }

    //이전 스테이지를 클리어 하지 않았을 경우 플레이 불가
    public void noRecentRecord(int stageNum, int roundId) {
        if (stageNum != 1) {
            Record findRecord = recordRepository.findByRecord(roundId, stageNum - 1,"clear");

            Optional.ofNullable(findRecord)
                    .orElseThrow(() -> new BusinessLogicException(ExceptionCode.PREVIOUS_STAGE_NO_CLEAR));
        }
    }
}
