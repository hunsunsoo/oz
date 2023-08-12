package com.fire4bird.oz.game.test;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrawReq {
    private String sessionId;
    private int x;
    private int y;
    private float width;
    private String color;
    private boolean paint;
}
