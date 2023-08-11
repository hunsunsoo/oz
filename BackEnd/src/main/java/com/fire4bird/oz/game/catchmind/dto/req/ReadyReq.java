package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReadyReq {
    private int role;
    private int state;
    private String rtcSession;
}
