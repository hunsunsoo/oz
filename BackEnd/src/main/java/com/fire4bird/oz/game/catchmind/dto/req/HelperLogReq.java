package com.fire4bird.oz.game.catchmind.dto.req;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class HelperLogReq {
    private int roundId;
    private int userId;
    private MultipartFile imageFile;
}
