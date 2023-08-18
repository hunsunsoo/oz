package com.fire4bird.oz.round.controller;

import com.fire4bird.oz.round.dto.Req.RoundStartReq;
import com.fire4bird.oz.round.dto.Res.RoundStartRes;
import com.fire4bird.oz.round.entity.Round;
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

        //회차 저장
        Round round = roundService.roundSave(req);

        //역할 저장
        RoundStartRes res = null;//회원이 아닌 유저 포함 or 시작하려는 인원이 4명이 아님
        if(roundService.roleSave(req, round)==1)
            res = roundService.responseData(req, round);
        SocketMessage msg = roundService.message(req,res);


        redisPublisher.publish(socketRepository.getTopic(req.getRtcSession()), msg);
    }

}
