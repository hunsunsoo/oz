package com.fire4bird.oz.record.mapper;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.Round;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface RecordMapper {

    Record toStartEntity(Round round, int stageNum, LocalDateTime startTime, int challengeTurn);

    Record toTotalRecordEntity(Round round, int stageNum, LocalDateTime accRecord);
}
