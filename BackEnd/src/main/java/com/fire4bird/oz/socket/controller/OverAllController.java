package com.fire4bird.oz.socket.controller;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.dto.SocketRoleDto;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
@Slf4j
public class OverAllController {
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;

    /**
     * websocket "/pub/socket/enter"로 들어오는 메시징을 처리한다.
     */
    @MessageMapping("/socket/enter")
    public void socketEnter(SocketMessage message) {
        socketRepository.enterSocketRoom(message.getRtcSession());
        message.setMessage(message.getUserId() + "님이 입장하셨습니다.");

        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    @MessageMapping("/socket/role")
    public void message(SocketMessage message) {
        socketRepository.enterSocketRoom(message.getRtcSession());
        message.setMessage(message.getUserId() + "님이 입장하셨습니다.");

        try {
            SocketRoleDto socketRoleDto = new SocketRoleDto();
            socketRoleDto.setMessage("@@@@@@@@@@@@@@@@@@@@@@@@@");
            message.setData(socketRoleDto);
        }catch (Exception e){
            log.info("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+e.getMessage());
        }

        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }
}
