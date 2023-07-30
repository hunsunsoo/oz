package com.fire4bird.oz.socket.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage {
    public enum MessageType{
        ENTER, PUZZLE, MESSAGE
    }

    private MessageType type;
    private String rtcSession;
    private Integer userId;
    private String message;
}
