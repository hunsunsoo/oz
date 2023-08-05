package com.fire4bird.oz.record.repository;

import com.fire4bird.oz.record.entity.Record;

public interface RecordRepositoryCustom {

    //기록 찾아오기
    Record findByRecord(int roundId, int stageNum);
}
