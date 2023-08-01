package com.fire4bird.oz.socket.controller;

import com.fire4bird.oz.socket.dto.SocketMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/socket")
public class StompSocketController {
    private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달

    //Clisent가 SEND할 수 있는 경로
    //WebStompConfig에서 설정한 applicationDestinationPrefixes와 @MessageMapping 경로가 병합됨
    //"/pub/socket/enter"
    @MessageMapping(value = "/enter")
    public void enter(SocketMessage message){
        if (SocketMessage.MessageType.ENTER.equals(message.getType()))
            message.setMessage(message.getUserId() + "님이 방에 참여하였습니다.");

        template.convertAndSend("/sub/socket/room/" + message.getRtcSession(), message);
    }

    @MessageMapping(value = "/message")
    public void message(SocketMessage message){
        template.convertAndSend("/sub/socket/room/" + message.getRtcSession(), message);
    }
}
