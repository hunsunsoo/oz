package com.fire4bird.oz.game.trap.controller;

import com.fire4bird.oz.game.trap.dto.req.LionMoveReq;
import com.fire4bird.oz.game.trap.dto.req.TrapStartReq;
import com.fire4bird.oz.game.trap.service.TrapService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class TrapController {

    private final TrapService trapService;

    @MessageMapping("trap/start")
    public void startGame(TrapStartReq req){
        System.out.println("d여기....여기사람잇어요..");
        trapService.gameStart(req);
    }

//    @MessageMapping("/trap/log")
//    public void trapGameLog()

    @MessageMapping("trap/move")
    public void lionMove(LionMoveReq req){
        trapService.lionMove(req);
    }



}
