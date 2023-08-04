package com.fire4bird.oz.socket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SocketRoomDto{

    @NonNull
    private int userId;
    @NotBlank
    private String rtcSession;
}