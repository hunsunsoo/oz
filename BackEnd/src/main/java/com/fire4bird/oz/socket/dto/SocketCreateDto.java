package com.fire4bird.oz.socket.dto;

import com.fire4bird.oz.socket.service.SocketService;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Getter
public class SocketCreateDto {
    @NotBlank
    private String rtcSession;
    @NotBlank
    private String teamName;

    private Set<WebSocketSession> sessions = new HashSet<>();

    @Builder
    public SocketCreateDto(String rtcSession, String teamName) {
        this.rtcSession = rtcSession;
        this.teamName = teamName;
    }

    public void handleActions(WebSocketSession session, SocketMessage socketMessage, SocketService socketService) {
        if (socketMessage.getType().equals(SocketMessage.MessageType.ENTER)) {
            sessions.add(session);
            socketMessage.setMessage(socketMessage.getUserId() + "이 "+socketMessage.getRtcSession()+"에 입장");
        }
        sendMessage(socketMessage, socketService);
    }

    public <T> void sendMessage(T message, SocketService socketService) {
        sessions.parallelStream().forEach(session -> socketService.sendMessage(session, message));
    }
}