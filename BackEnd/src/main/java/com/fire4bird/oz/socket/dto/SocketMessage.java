package com.fire4bird.oz.socket.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocketMessage {
    public enum MessageType{
        ENTER, TALK
    }

    private MessageType type;//메시지 타입
    private String roomId;//방번호
    private String sender;//메시지 보낸사람
    private String message;//메시지
}
