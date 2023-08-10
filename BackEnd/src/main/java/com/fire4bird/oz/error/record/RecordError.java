package com.fire4bird.oz.error.record;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.record.repository.RecordRepository;
import com.fire4bird.oz.round.entity.Round;
import com.fire4bird.oz.round.service.RoundService;
import com.fire4bird.oz.team.entity.UserTeam;
import com.fire4bird.oz.user.entity.User;
import com.fire4bird.oz.user.service.UserService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
@Component
@RequiredArgsConstructor
public class RecordError {

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
    public void stageNumValid(int stageNum) {
        if (stageNum < 1 || stageNum > 4) {
            throw new BusinessLogicException(ExceptionCode.STAGE_NUM_NOT_VALID);
        }
    }
}
