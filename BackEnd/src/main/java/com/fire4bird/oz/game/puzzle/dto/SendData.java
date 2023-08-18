package com.fire4bird.oz.game.puzzle.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
public class SendData {

    private int location;
    private String puzzle;

}
