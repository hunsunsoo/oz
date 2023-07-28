package com.fire4bird.oz.team.entity;

import com.fire4bird.oz.user.entity.User;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserTeamPK implements Serializable {
    private User user;
    private Team team;
}
