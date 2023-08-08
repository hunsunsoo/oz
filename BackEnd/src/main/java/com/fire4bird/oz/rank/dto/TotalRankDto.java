package com.fire4bird.oz.rank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TotalRankDto {
    private String teamName;
    private String time;
    private long rank;

}
