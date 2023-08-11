package com.fire4bird.oz.game.trap.dto.res;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SendResult {
    // 클리어 1, 실패 0
    private int resultCode;
}
