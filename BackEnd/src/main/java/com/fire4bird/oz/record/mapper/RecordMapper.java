package com.fire4bird.oz.record.mapper;

import com.fire4bird.oz.record.entity.Record;
import com.fire4bird.oz.round.entity.Round;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RecordMapper {
    Record toEntity(Round round, int stageNum);
}
