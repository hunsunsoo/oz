package com.fire4bird.oz.rank.dto;

import lombok.Data;

import java.util.List;

@Data
public class RankResponseDto {
    private List<TotalRankDto> totalRankList;

    private List<MyRankDto> myRankDtoList;
}
