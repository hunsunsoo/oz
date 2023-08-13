package com.fire4bird.oz.game.catchmind.dto;

import lombok.Data;

@Data
public class DrawingDto {
    private String sessionId;
    private int x;
    private int y;
    private float width;
    private String color;
    private boolean paint;
}
