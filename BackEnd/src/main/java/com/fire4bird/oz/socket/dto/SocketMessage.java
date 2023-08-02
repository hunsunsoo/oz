package com.fire4bird.oz.socket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage implements Serializable {

    @NotBlank
    private String type;
    @NotBlank
    private String rtcSession;
    @NotNull
    private Integer userId;
    private String message;
    private Object data;
}