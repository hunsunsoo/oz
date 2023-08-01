package com.fire4bird.oz.team.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RegistTeamDto {
    private List<Integer> users;
    private String teamName;
}
