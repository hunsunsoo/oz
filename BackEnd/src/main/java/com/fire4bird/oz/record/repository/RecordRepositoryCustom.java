package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;

import java.time.LocalDateTime;
import java.util.List;

public interface RecordRepositoryCustom {

    //기록 찾아오기
    Record findByRecord(int roundId, int stageNum);

    //클리어시 사용될 기록 찾아오기 - 시간 데이터만 리스트로
    List<LocalDateTime> findByTimeRecord(int roundId, int stageNum);
}
