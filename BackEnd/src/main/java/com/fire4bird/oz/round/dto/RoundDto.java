package com.fire4bird.oz.round.dto;

import lombok.Getter;

// 모험 시작 시 받을 데이터(역할, 유저 아이디, 팀명)
@Getter
public class RoundDto {

    private int userId;
    private int role;//1:도로시 2:사자 3:허수아비 4:양철나무꾼
    private String teamName;

}
