package com.fire4bird.oz.socket.dto;

import lombok.*;
import org.springframework.web.socket.WebSocketMessage;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage {
    public enum MessageType{
        ENTER, MESSAGE, ROLE, PUZZLE
    }

    private MessageType type;
    private String rtcSession;
    private Integer userId;
    private String message;
    private WebSocketMessage object;
}
