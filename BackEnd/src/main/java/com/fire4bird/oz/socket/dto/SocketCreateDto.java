package com.fire4bird.oz.socket.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Builder
@Getter
public class SocketCreateDto {
    @NotBlank
    private String rtcSession;
    @NotBlank
    private String teamName;

    private Set<WebSocketSession> sessions = new HashSet<>();

    public static SocketCreateDto create(String rtcSession, String teamName) {
        return SocketCreateDto.builder().rtcSession(rtcSession).teamName(teamName).build();
    }
}