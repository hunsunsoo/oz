package com.fire4bird.oz.socket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage implements Serializable {

    private String type;
    private String rtcSession;
    private Integer userId;
    private String message;
    private Object data;
}