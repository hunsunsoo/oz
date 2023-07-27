package com.fire4bird.oz.round.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

// 모험 시작 시 받을 데이터(역할, 유저 일련번호, 팀명)
@Getter
@Setter
public class RoundDto {

    private List<RoleDTO> userRole;
    private String teamName;

    @Getter
    @Setter
    public static class RoleDTO {
        private Integer userId;
        private Integer role;//1:도로시 2:사자 3:허수아비 4:양철나무꾼
    }

}
