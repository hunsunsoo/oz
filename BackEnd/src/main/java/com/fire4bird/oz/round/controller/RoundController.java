package com.fire4bird.oz.round.controller;

import com.fire4bird.oz.round.dto.Req.RoundStartReq;
import com.fire4bird.oz.round.service.RoundService;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RoundController {
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;
    private final RoundService roundService;

    @MessageMapping("/round/start")
    public void roundStart(RoundStartReq req) {
        //방장이 start 했는지 판별
        int owner = socketRepository.findOwnerById(req.getRtcSession());
        if(owner != req.getUserId())
            return;

        SocketMessage msg = SocketMessage.builder()
                .message("모험 시작")
                .data(roundService.roundSave(req))
                .rtcSession(req.getRtcSession())
                .type("round/start")
                .userId(req.getUserId())
                .build();
        redisPublisher.publish(socketRepository.getTopic(req.getRtcSession()), msg);
    }

}
