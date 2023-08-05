package com.fire4bird.oz.game.calculation.entity;

import com.fire4bird.oz.user.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Player {
    private User user;
    private int role;
    private boolean isReady;

    public Player(User user, int role){
        this.user = user;
        this.role = role;
        this.isReady = false;
    }
}
