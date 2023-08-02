package com.fire4bird.oz.game.calculation.entity;

import com.fire4bird.oz.user.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Player {
    private User user;
    private String role;

    public Player(User user, String role){
        this.user = user;
        this.role = role;
    }
}
