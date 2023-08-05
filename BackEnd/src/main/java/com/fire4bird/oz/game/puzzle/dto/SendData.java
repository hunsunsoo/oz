package com.fire4bird.oz.game.puzzle.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SendData {

    private int location;
    private String puzzle;

}
