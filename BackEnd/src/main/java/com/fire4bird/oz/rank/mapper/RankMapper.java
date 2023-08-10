package com.fire4bird.oz.rank.mapper;

import com.fire4bird.oz.rank.dto.MyRankDto;
import com.fire4bird.oz.rank.dto.RankResponseDto;
import com.fire4bird.oz.rank.dto.TotalRankDto;
import org.mapstruct.Mapper;

import java.sql.Time;
import java.time.LocalTime;
import java.util.List;

@Mapper(componentModel = "spring")
public interface RankMapper {

    RankResponseDto toRankResponseDto(List<TotalRankDto> totalRankList, List<MyRankDto> myRankDtoList);

    List<TotalRankDto> totalRankListToList(List<Object[]> totalRankList);

    default TotalRankDto objectToToTalRankDto(Object[] objects) {
        Time sqlTime = (Time) objects[2];
        LocalTime localTime = sqlTime.toLocalTime();

        return TotalRankDto.builder()
                .rank((long) objects[0])
                .teamName(String.valueOf(objects[1]))
                .time(localTime.getHour() + "시간 " +
                        localTime.getMinute() + "분 " +
                        localTime.getSecond() + "초").build();
    }

    List<MyRankDto> myRankListToList(List<Object[]> myRankList);

    default MyRankDto objectToMyRankDto(Object[] objects) {
        Time sqlTime = (Time) objects[2];
        LocalTime localTime = sqlTime.toLocalTime();

        return MyRankDto.builder()
                .rank((long) objects[0])
                .teamName(String.valueOf(objects[1]))
                .time(localTime.getHour() + "시간 " +
                        localTime.getMinute() + "분 " +
                        localTime.getSecond() + "초").build();
    }
}
