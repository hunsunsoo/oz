package com.fire4bird.oz.socket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.WebSocketSession;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Builder
@Getter
public class SocketCreateDto implements Serializable{
    @NotBlank
    private String rtcSession;
    @NotBlank
    private String teamName;
    private int userCnt;//소켓방 인원수
}