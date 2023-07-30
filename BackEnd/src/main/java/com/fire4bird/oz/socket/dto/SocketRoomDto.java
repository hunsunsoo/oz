package com.fire4bird.oz.socket.dto;

import com.fire4bird.oz.socket.service.SocketService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Getter
public class SocketRoomDto {
    @NotBlank
    private String rtcSession;
    @NotBlank
    private String teamName;

    private Set<WebSocketSession> sessions = new HashSet<>();

    @Builder
    public SocketRoomDto(String RTCSession, String teamName) {
        this.rtcSession = RTCSession;
        this.teamName = teamName;
    }

    public void handleActions(WebSocketSession session, SocketMessage chatMessage, SocketService chatService) {
        if (chatMessage.getType().equals(SocketMessage.MessageType.ENTER)) {
            sessions.add(session);
            chatMessage.setMessage(chatMessage.getSender() + "님이 입장했습니다.");
        }
        sendMessage(chatMessage, chatService);
    }

    public <T> void sendMessage(T message, SocketService chatService) {
        sessions.parallelStream().forEach(session -> chatService.sendMessage(session, message));
    }
}