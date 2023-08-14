package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Data;

@Data
public class PassReq {
    private String rtcSession;
    private int userId;
    private int currentRole;
    private String png;
}
