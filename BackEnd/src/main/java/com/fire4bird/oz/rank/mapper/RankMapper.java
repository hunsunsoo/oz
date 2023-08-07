package com.fire4bird.oz.rank.mapper;

import com.fire4bird.oz.rank.dto.MyRankDto;
import com.fire4bird.oz.rank.dto.RankResponseDto;
import com.fire4bird.oz.rank.dto.TotalRankDto;
import com.querydsl.core.Tuple;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.team.entity.QTeam.team;

@Mapper(componentModel = "spring")
public interface RankMapper {

    RankResponseDto toRankResponseDto(List<TotalRankDto> totalRankList, List<MyRankDto> myRankDtoList);

    default List<TotalRankDto> toTotalRankDtoList(List<Tuple> tupleList) {
        AtomicLong rank = new AtomicLong(1);

        return tupleList.stream()
                .map(tuple -> {
                    TotalRankDto totalRankDto = new TotalRankDto();

                    totalRankDto.setRank(rank.getAndIncrement());
                    totalRankDto.setTime(
                            tuple.get(record.accRecord.hour()) + "시간 " +
                                    tuple.get(record.accRecord.minute()) + "분 " +
                                    tuple.get(record.accRecord.second()) + "초");
                    totalRankDto.setTeamName(tuple.get(team.teamName));

                    return totalRankDto;
                }).collect(Collectors.toList());
    }
}
