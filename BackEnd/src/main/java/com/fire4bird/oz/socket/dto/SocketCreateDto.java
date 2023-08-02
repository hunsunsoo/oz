package com.fire4bird.oz.socket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SocketCreateDto implements Serializable{
    @NotBlank
    private String rtcSession;
    @NotBlank
    private String teamName;
}