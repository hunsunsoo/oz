package com.fire4bird.oz.rank.mapper;

import com.fire4bird.oz.rank.dto.MyRankDto;
import com.fire4bird.oz.rank.dto.RankResponseDto;
import com.fire4bird.oz.rank.dto.TotalRankDto;
import com.querydsl.core.Tuple;
import org.mapstruct.Mapper;

import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import static com.fire4bird.oz.record.entity.QRecord.record;
import static com.fire4bird.oz.round.entity.QRound.round;
import static com.fire4bird.oz.team.entity.QTeam.team;

@Mapper(componentModel = "spring")
public interface RankMapper {

    RankResponseDto toRankResponseDto(List<TotalRankDto> totalRankList, List<MyRankDto> myRankDtoList);

    default List<TotalRankDto> toTotalRankDtoList(List<Tuple> tupleList) {
        AtomicLong rank = new AtomicLong(1);

        return tupleList.stream()
                .limit(10)// 10번만 순회 진행
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

    default List<MyRankDto> toMyRankDto(List<Tuple> myRank, List<Long> rankNum) {
        AtomicLong idx = new AtomicLong(0);

        return myRank.stream()
                .map(tuple -> {
                    LocalTime localTime = tuple.get(record.accRecord);

                    MyRankDto myRankDto = new MyRankDto();
                    myRankDto.setRank(rankNum.get((int) idx.getAndIncrement()));
                    myRankDto.setTime(
                            localTime.getHour() + "시간 " +
                                    localTime.getMinute() + "분 " +
                                    localTime.getSecond() + "초"
                    );
                    myRankDto.setTeamName(tuple.get(round.team.teamName));

                    return myRankDto;
                }).collect(Collectors.toList());

    }

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
        LocalTime localTime = LocalTime.parse((String) objects[2]);

        return MyRankDto.builder()
                .rank((long) objects[0])
                .teamName(String.valueOf(objects[1]))
                .time(localTime.getHour() + "시간 " +
                        localTime.getMinute() + "분 " +
                        localTime.getSecond() + "초").build();
    }
}
