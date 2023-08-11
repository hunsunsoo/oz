package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartReq {
    private String rtcSession;
    private int userId;
}
