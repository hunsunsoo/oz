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
        //입장, 퇴장, 그 외 메시지...
        ENTER, QUIT, MESSAGE
    }

    private MessageType type;
    private String rtcSession;
    private Integer userId;
    private int userCnt;//채팅 인원수
    private String message;
    private Object data;
}
