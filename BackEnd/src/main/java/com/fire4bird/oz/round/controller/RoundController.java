package com.fire4bird.oz.round.controller;

import com.fire4bird.oz.error.BusinessLogicException;
import com.fire4bird.oz.error.ExceptionCode;
import com.fire4bird.oz.game.calculation.dto.response.HelperSubmitRes;
import com.fire4bird.oz.game.puzzle.manager.PuzzleGameManager;
import com.fire4bird.oz.round.dto.Req.RoundStartReq;
import com.fire4bird.oz.round.service.RoundService;
import com.fire4bird.oz.socket.dto.SocketMessage;
import com.fire4bird.oz.socket.repository.SocketRepository;
import com.fire4bird.oz.socket.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RoundController {
    private final RedisPublisher redisPublisher;
    private final SocketRepository socketRepository;
    private final RoundService roundService;

    @MessageMapping("/round/start")
    public void roundStart(RoundStartReq req) {
        SocketMessage msg = new SocketMessage();

        //방장이 start 했는지 판별
        int owner = socketRepository.findOwnerById(req.getRtcSession());
        if(owner != req.getUserId())
            return;

        msg.setMessage("모험 시작");
        msg.setData(roundService.roundSave(req));
        msg.setRtcSession(req.getRtcSession());
        msg.setType("round/start");
        redisPublisher.publish(socketRepository.getTopic(req.getRtcSession()), msg);
    }

}
