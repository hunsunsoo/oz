package com.fire4bird.oz.socket.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocketReadyDto implements Serializable {

    private String type;
    private String rtcSession;
    private Integer userId;
    private String message;
    private Integer stage;
    private Integer state;

}
