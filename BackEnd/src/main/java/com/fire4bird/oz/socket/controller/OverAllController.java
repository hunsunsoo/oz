package com.fire4bird.oz.socket.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.dto.SocketRoleDto;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import com.fire4bird.oz.socket.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;

@RequiredArgsConstructor
@Controller
@Slf4j
public class OverAllController {
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;
    private final RoleService roleService;

    /**
     * websocket "/pub/socket/enter"로 들어오는 메시징을 처리한다.
     */
    @MessageMapping("/socket/role")
    public void socketRole(SocketMessage message) {
        try {
            // ObjectMapper를 사용하여 JSON을 SocketRoleDto 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonString = objectMapper.writeValueAsString(message.getData());
            SocketRoleDto socketRoleDto = objectMapper.readValue(jsonString, SocketRoleDto.class);

            socketRoleDto = roleService.roleSelect(message, socketRoleDto);
            message.setData(socketRoleDto);
        }catch (Exception e){
            message.setMessage("error: "+e.getMessage());
            log.info(e.getMessage());
        }
        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    @MessageMapping("/socket/waiting")
    public void waitingNext(SocketMessage message) {
        int owner = socketRepository.findOwnerById(message.getRtcSession());
        if(owner != message.getUserId())
            return;

        SocketMessage msg = SocketMessage.builder()
                .message("모험 시작")
                .data(1)
                .rtcSession(message.getRtcSession())
                .type("/waiting")
                .userId(message.getUserId())
                .build();

        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }

    @MessageMapping("/socket/chat")
    public void waitingChat(SocketMessage message) {
        SocketMessage msg = SocketMessage.builder()
                .message(message.getMessage())
                .data(message.getData())
                .rtcSession(message.getRtcSession())
                .type("chat")
                .userId(message.getUserId())
                .build();

        redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
    }
}
