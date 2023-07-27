package com.fire4bird.oz.round.dto;

import lombok.Getter;

import java.util.List;

// 모험 시작 시 받을 데이터(역할, 유저 일련번호, 팀명)
@Getter
public class RoundDto {

    private RoleDTO userRole;
    private String teamName;
    private static List<RoleDTO> roleDTOList;

    @Getter
    public static class RoleDTO {
        private Integer userId;
        private Integer role;//1:도로시 2:사자 3:허수아비 4:양철나무꾼
    }

    public static List<RoleDTO> getRoleList() {
        return roleDTOList;
    }
}
