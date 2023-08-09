package com.fire4bird.oz.game.trap.dto.res;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SendLion {
    private int distanceKey;
    private String screen;
    private byte hasKey;
}
