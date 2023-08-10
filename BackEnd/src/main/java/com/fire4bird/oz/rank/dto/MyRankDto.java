package com.fire4bird.oz.rank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MyRankDto {
    private String teamName;
    private String time;
    private long rank;
}
