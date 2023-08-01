package com.fire4bird.oz.socket.controller;

import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class RedisTestController {
        private final RedisPublisher redisPublisher;
        private final SocketRepository socketRepository;

        /**
         * websocket "/pub/socket/message"로 들어오는 메시징을 처리한다.
         */
        @MessageMapping("/socket/message")
        public void message(SocketMessage message) {
            if (SocketMessage.MessageType.ENTER.equals(message.getType())) {
                socketRepository.enterSocketRoom(message.getRtcSession());
                message.setMessage(message.getUserId() + "님이 입장하셨습니다.");
            }
            // Websocket에 발행된 메시지를 redis로 발행한다(publish)
            redisPublisher.publish(socketRepository.getTopic(message.getRtcSession()), message);
        }
    }
